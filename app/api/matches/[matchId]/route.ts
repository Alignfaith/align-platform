import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit-memory'

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

export async function GET(
  req: NextRequest,
  { params }: { params: { matchId: string } }
) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'web-matches-view').limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const match = await prisma.match.findUnique({
    where: { id: params.matchId },
    select: {
      id: true,
      status: true,
      senderId: true,
      receiverId: true,
      alignmentScore: true,
      alignmentTier: true,
      hardStopTriggered: true,
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
  })

  if (!match) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (match.hardStopTriggered || ['DECLINED', 'EXPIRED', 'UNMATCHED'].includes(match.status)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const isSender = match.senderId === session.user.id
  const isReceiver = match.receiverId === session.user.id
  if (!isSender && !isReceiver) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const myPhase1 = isSender ? match.senderPhase1 : match.receiverPhase1
  const theirPhase1 = isSender ? match.receiverPhase1 : match.senderPhase1
  const myPhase2 = isSender ? match.senderPhase2 : match.receiverPhase2
  const theirPhase2 = isSender ? match.receiverPhase2 : match.senderPhase2
  const otherProfile = isSender ? match.receiver.profile : match.sender.profile

  const phase1Mutual = myPhase1 === 'APPROVED' && theirPhase1 === 'APPROVED'
  const consentPhase: 1 | 2 | 3 = match.status === 'MATCHED' ? 3 : phase1Mutual ? 2 : 1

  const myDecision =
    consentPhase === 1 ? myPhase1 :
    consentPhase === 2 ? myPhase2 :
    'APPROVED'

  const awaitingThem =
    consentPhase === 1 ? (myPhase1 === 'APPROVED' && theirPhase1 === null) :
    consentPhase === 2 ? (myPhase2 === 'APPROVED' && theirPhase2 === null) :
    false

  const base = {
    matchId: match.id,
    consentPhase,
    alignmentScore: match.alignmentScore,
    alignmentTier: match.alignmentTier,
    myDecision,
    awaitingThem,
  }

  if (consentPhase >= 2 && otherProfile) {
    return NextResponse.json({
      ...base,
      firstName: otherProfile.firstName,
      age: calculateAge(otherProfile.dateOfBirth),
      photoUrl: otherProfile.photos[0]?.url ?? null,
      ...(consentPhase === 3 ? { conversationId: match.conversation?.id ?? null } : {}),
    })
  }

  return NextResponse.json(base)
}
