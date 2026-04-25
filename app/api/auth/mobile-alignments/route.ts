import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit-memory'

const schema = z.object({
  supabaseUserId: z.string().uuid(),
})

function calculateAge(dob: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--
  }
  return age
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'mobile-alignments').limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    console.log('[mobile-alignments] Step 1: params')
    const { supabaseUserId } = schema.parse({
      supabaseUserId: req.nextUrl.searchParams.get('supabaseUserId'),
    })
    console.log('[mobile-alignments] Step 1 OK: supabaseUserId =', supabaseUserId)

    console.log('[mobile-alignments] Step 2: looking up profile')
    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId },
      select: { id: true, userId: true },
    })
    if (!profile) {
      console.log('[mobile-alignments] Step 2: profile not found')
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    console.log('[mobile-alignments] Step 2 OK: profileId =', profile.id, ', userId =', profile.userId)

    console.log('[mobile-alignments] Step 3: fetching matches')
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ senderId: profile.userId }, { receiverId: profile.userId }],
        hardStopTriggered: false,
        status: { notIn: ['DECLINED', 'EXPIRED', 'UNMATCHED'] },
      },
      select: {
        id: true,
        status: true,
        senderId: true,
        receiverId: true,
        alignmentScore: true,
        alignmentTier: true,
        senderPhase1: true,
        receiverPhase1: true,
        senderPhase2: true,
        receiverPhase2: true,
        conversation: { select: { id: true } },
        sender: {
          select: {
            profile: {
              select: {
                firstName: true,
                dateOfBirth: true,
                photos: {
                  where: { isPrimary: true, isApproved: true },
                  take: 1,
                  select: { url: true },
                },
              },
            },
          },
        },
        receiver: {
          select: {
            profile: {
              select: {
                firstName: true,
                dateOfBirth: true,
                photos: {
                  where: { isPrimary: true, isApproved: true },
                  take: 1,
                  select: { url: true },
                },
              },
            },
          },
        },
      },
      orderBy: { alignmentScore: 'desc' },
    })
    console.log('[mobile-alignments] Step 3 OK: raw match count =', matches.length)

    const result = matches.map((m) => {
      const isSender = m.senderId === profile.userId
      const myPhase1 = isSender ? m.senderPhase1 : m.receiverPhase1
      const theirPhase1 = isSender ? m.receiverPhase1 : m.senderPhase1
      const myPhase2 = isSender ? m.senderPhase2 : m.receiverPhase2
      const theirPhase2 = isSender ? m.receiverPhase2 : m.senderPhase2
      const otherProfile = isSender ? m.receiver.profile : m.sender.profile

      const phase1Mutual = myPhase1 === 'APPROVED' && theirPhase1 === 'APPROVED'
      const consentPhase: 1 | 2 | 3 = m.status === 'MATCHED' ? 3 : phase1Mutual ? 2 : 1

      const myDecision =
        consentPhase === 1 ? myPhase1 :
        consentPhase === 2 ? myPhase2 :
        'APPROVED'

      const awaitingThem =
        consentPhase === 1 ? (myPhase1 === 'APPROVED' && theirPhase1 === null) :
        consentPhase === 2 ? (myPhase2 === 'APPROVED' && theirPhase2 === null) :
        false

      const base = {
        matchId: m.id,
        consentPhase,
        alignmentScore: m.alignmentScore,
        alignmentTier: m.alignmentTier,
        myDecision,
        awaitingThem,
      }

      if (consentPhase >= 2 && otherProfile) {
        return {
          ...base,
          firstName: otherProfile.firstName,
          age: calculateAge(otherProfile.dateOfBirth),
          photoUrl: otherProfile.photos[0]?.url ?? null,
          ...(consentPhase === 3 ? { conversationId: m.conversation?.id ?? null } : {}),
        }
      }

      return base
    })

    console.log('[mobile-alignments] Step 3: returning', result.length, 'matches')
    return NextResponse.json({ matches: result })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid supabaseUserId' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    console.error('[mobile-alignments] CAUGHT ERROR:', message)
    console.error('[mobile-alignments] stack:', stack)
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 })
  }
}
