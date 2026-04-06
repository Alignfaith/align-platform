import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateMatch, PillarAnswers } from '@/lib/matching'

export async function POST(req: Request) {
  try {
    console.log('[assessment/complete] Step 1: parsing session')
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      console.log('[assessment/complete] No session — unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log('[assessment/complete] Step 1 OK: userId =', session.user.id)

    console.log('[assessment/complete] Step 2: parsing request body')
    const { responses } = await req.json()
    console.log('[assessment/complete] Step 2 OK: responses count =', responses?.length, '| first =', JSON.stringify(responses?.[0]))

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json({ error: 'responses array is required' }, { status: 400 })
    }

    console.log('[assessment/complete] Step 3: looking up profile')
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })
    console.log('[assessment/complete] Step 3 OK: profileId =', profile?.id)

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    console.log('[assessment/complete] Step 4: upserting pillarResponses')
    await Promise.all(
      responses.map((r: { questionId: string; pillar: string; value: number }) =>
        prisma.pillarResponse.upsert({
          where: { profileId_questionId: { profileId: profile.id, questionId: r.questionId } },
          update: { value: r.value },
          create: { profileId: profile.id, questionId: r.questionId, pillar: r.pillar as any, value: r.value },
        })
      )
    )
    console.log('[assessment/complete] Step 4 OK: pillarResponses upserted')

    console.log('[assessment/complete] Step 5: creating Assessment record')
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
    console.log('[assessment/complete] Step 5 OK: Assessment created')

    console.log('[assessment/complete] Step 6: fetching other profiles for matching')
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
    console.log('[assessment/complete] Step 6 OK: other profiles count =', otherProfiles.length)

    console.log('[assessment/complete] Step 7: calculating matches')
    await Promise.all(
      otherProfiles.map(async (candidate) => {
        const candidateAnswers: PillarAnswers = Object.fromEntries(
          candidate.pillarResponses.map((r) => [r.questionId, r.value])
        )
        const result = calculateMatch(myAnswers, candidateAnswers)
        console.log('[assessment/complete] Match result for', candidate.userId, ':', JSON.stringify(result))
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
    console.log('[assessment/complete] Step 7 OK: matches upserted')

    return NextResponse.json({ success: true, matchesCalculated: otherProfiles.length })
  } catch (error) {
    console.error('[assessment/complete] CAUGHT ERROR:', error)
    if (error instanceof Error) {
      console.error('[assessment/complete] message:', error.message)
      console.error('[assessment/complete] stack:', error.stack)
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
