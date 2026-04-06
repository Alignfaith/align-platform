import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateMatch, PillarAnswers } from '@/lib/matching'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { profileIdA, profileIdB } = await req.json()

    if (!profileIdA || !profileIdB) {
      return NextResponse.json({ error: 'Both profileIdA and profileIdB are required' }, { status: 400 })
    }

    const [responsesA, responsesB] = await Promise.all([
      prisma.pillarResponse.findMany({ where: { profileId: profileIdA } }),
      prisma.pillarResponse.findMany({ where: { profileId: profileIdB } }),
    ])

    if (!responsesA.length || !responsesB.length) {
      return NextResponse.json({ error: 'One or both users have not completed their pillar assessment' }, { status: 400 })
    }

    const answersA: PillarAnswers = Object.fromEntries(responsesA.map((r) => [r.questionId, r.value]))
    const answersB: PillarAnswers = Object.fromEntries(responsesB.map((r) => [r.questionId, r.value]))

    const result = calculateMatch(answersA, answersB)

    const [profileA, profileB] = await Promise.all([
      prisma.profile.findUnique({ where: { id: profileIdA }, select: { userId: true } }),
      prisma.profile.findUnique({ where: { id: profileIdB }, select: { userId: true } }),
    ])

    if (!profileA || !profileB) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const match = await prisma.match.upsert({
      where: { senderId_receiverId: { senderId: profileA.userId, receiverId: profileB.userId } },
      update: {
        alignmentScore: result.score,
        alignmentTier: result.tier,
        hardStopTriggered: result.hardStopTriggered,
        hardStopReason: result.hardStopReason,
        pillarBreakdown: result.pillarBreakdown ?? undefined,
      },
      create: {
        senderId: profileA.userId,
        receiverId: profileB.userId,
        alignmentScore: result.score,
        alignmentTier: result.tier,
        hardStopTriggered: result.hardStopTriggered,
        hardStopReason: result.hardStopReason,
        pillarBreakdown: result.pillarBreakdown ?? undefined,
      },
    })

    return NextResponse.json({ match, result })
  } catch (error) {
    console.error('[matching/calculate] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
