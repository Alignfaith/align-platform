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
      where: { senderId: profile.userId, hardStopTriggered: false },
      select: {
        alignmentScore: true,
        alignmentTier: true,
        receiver: {
          select: {
            id: true,
            tier: true,
            isFoundingMember: true,
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
    console.log('[mobile-alignments] Step 3 OK: raw matches count =', matches.length)

    const result = matches
      .filter((m) => m.receiver.profile !== null)
      .map((m) => {
        const p = m.receiver.profile!
        return {
          userId: m.receiver.id,
          firstName: p.firstName,
          age: calculateAge(p.dateOfBirth),
          photoUrl: p.photos[0]?.url ?? null,
          tier: m.receiver.tier,
          isFounder: m.receiver.isFoundingMember,
          alignmentScore: m.alignmentScore,
          alignmentTier: m.alignmentTier,
        }
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
