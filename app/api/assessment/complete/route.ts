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

    const { responses } = await req.json()

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json({ error: 'responses array is required' }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    await Promise.all(
      responses.map((r: { questionId: string; pillar: string; value: number }) =>
        prisma.pillarResponse.upsert({
          where: { profileId_questionId: { profileId: profile.id, questionId: r.questionId } },
          update: { value: r.value },
          create: { profileId: profile.id, questionId: r.questionId, pillar: r.pillar as any, value: r.value },
        })
      )
    )

    await prisma.assessment.create({
      data: {
        profileId: profile.id,
        responses: {
          create: responses.map((r: { questionId: string; pillar: string; value: number }) => ({
            questionId: r.questionId,
            pillar: r.pillar as any,
            value: r.value,
          })),
        },
      },
    })

    const myAnswers: PillarAnswers = Object.fromEntries(
      responses.map((r: { questionId: string; value: number }) => [r.questionId, r.value])
    )

    const otherProfiles = await prisma.profile.findMany({
      where: {
        id: { not: profile.id },
        isActive: true,
        isComplete: true,
        pillarResponses: { some: {} },
      },
      select: {
        id: true,
        userId: true,
        pillarResponses: { select: { questionId: true, value: true } },
      },
    })

    await Promise.all(
      otherProfiles.map(async (candidate) => {
        const candidateAnswers: PillarAnswers = Object.fromEntries(
          candidate.pillarResponses.map((r) => [r.questionId, r.value])
        )
        const result = calculateMatch(myAnswers, candidateAnswers)
        return prisma.match.upsert({
          where: { senderId_receiverId: { senderId: session.user.id, receiverId: candidate.userId } },
          update: {
            alignmentScore: result.score,
            alignmentTier: result.tier,
            hardStopTriggered: result.hardStopTriggered,
            hardStopReason: result.hardStopReason,
            pillarBreakdown: result.pillarBreakdown ?? undefined,
          },
          create: {
            senderId: session.user.id,
            receiverId: candidate.userId,
            alignmentScore: result.score,
            alignmentTier: result.tier,
            hardStopTriggered: result.hardStopTriggered,
            hardStopReason: result.hardStopReason,
            pillarBreakdown: result.pillarBreakdown ?? undefined,
          },
        })
      })
    )

    return NextResponse.json({ success: true, matchesCalculated: otherProfiles.length })
  } catch (error) {
    console.error('[assessment/complete] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
