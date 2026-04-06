import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateMatch, PillarAnswers } from '@/lib/matching'
import { ALL_QUESTIONS } from '@/lib/pillar-questions'
import { Pillar } from '@prisma/client'

// Build question → pillar lookup once at module level
const Q_TO_PILLAR = new Map<string, Pillar>(
  ALL_QUESTIONS.map((q) => [q.id, q.pillar as Pillar])
)

export async function POST(req: Request) {
  try {
    console.log('[assessment/complete] Step 1: parsing session')
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      console.log('[assessment/complete] No session — unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log('[assessment/complete] Step 1 OK: userId =', session.user.id)

    console.log('[assessment/complete] Step 2: parsing request body')
    const { responses } = await req.json() as { responses: { questionId: string; value: number }[] }
    console.log('[assessment/complete] Step 2 OK: responses count =', responses?.length)

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json({ error: 'responses array is required' }, { status: 400 })
    }

    // Validate all questionIds are known
    for (const r of responses) {
      if (!Q_TO_PILLAR.has(r.questionId)) {
        return NextResponse.json({ error: `Unknown questionId: ${r.questionId}` }, { status: 400 })
      }
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

    console.log('[assessment/complete] Step 4: creating Assessment record with responses')
    await prisma.assessment.create({
      data: {
        profileId: profile.id,
        responses: {
          create: responses.map((r) => ({
            questionId: r.questionId,
            pillar: Q_TO_PILLAR.get(r.questionId)!,
            value: r.value,
          })),
        },
      },
    })
    console.log('[assessment/complete] Step 4 OK: Assessment created')

    console.log('[assessment/complete] Step 5: upserting PillarResponse records')
    await Promise.all(
      responses.map((r) =>
        prisma.pillarResponse.upsert({
          where: { profileId_questionId: { profileId: profile.id, questionId: r.questionId } },
          update: { value: r.value },
          create: {
            profileId: profile.id,
            questionId: r.questionId,
            pillar: Q_TO_PILLAR.get(r.questionId)!,
            value: r.value,
          },
        })
      )
    )
    console.log('[assessment/complete] Step 5 OK: PillarResponses upserted')

    console.log('[assessment/complete] Step 6: fetching other profiles for matching')
    const myAnswers: PillarAnswers = Object.fromEntries(
      responses.map((r) => [r.questionId, r.value])
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

    if (otherProfiles.length > 0) {
      console.log('[assessment/complete] Step 7: calculating and upserting matches')
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
              hardStopReason: result.hardStopReason ?? null,
              pillarBreakdown: result.pillarBreakdown ?? undefined,
            },
            create: {
              senderId: session.user.id,
              receiverId: candidate.userId,
              alignmentScore: result.score,
              alignmentTier: result.tier,
              hardStopTriggered: result.hardStopTriggered,
              hardStopReason: result.hardStopReason ?? null,
              pillarBreakdown: result.pillarBreakdown ?? undefined,
            },
          })
        })
      )
      console.log('[assessment/complete] Step 7 OK: matches upserted')
    }

    return NextResponse.json({ success: true, matchesCalculated: otherProfiles.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    console.error('[assessment/complete] CAUGHT ERROR:', message)
    console.error('[assessment/complete] stack:', stack)
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 })
  }
}
