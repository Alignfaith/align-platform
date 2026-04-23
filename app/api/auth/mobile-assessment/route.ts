import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { calculateMatch, PillarAnswers } from '@/lib/matching'
import { ALL_QUESTIONS } from '@/lib/pillar-questions'
import { Pillar } from '@prisma/client'
import { checkRateLimit } from '@/lib/rate-limit-memory'

const Q_TO_PILLAR = new Map<string, Pillar>(
  ALL_QUESTIONS.map((q) => [q.id, q.pillar as Pillar])
)

const schema = z.object({
  supabaseUserId: z.string().uuid(),
  responses: z
    .array(
      z.object({
        questionId: z.string(),
        value: z.number().int().min(1).max(5),
      })
    )
    .min(1),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'mobile-assessment').limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    console.log('[mobile-assessment] Step 1: parsing body')
    const body = await req.json()
    const { supabaseUserId, responses } = schema.parse(body)
    console.log('[mobile-assessment] Step 1 OK: supabaseUserId =', supabaseUserId, 'responses count =', responses.length)

    // Validate all questionIds are known
    for (const r of responses) {
      if (!Q_TO_PILLAR.has(r.questionId)) {
        return NextResponse.json({ error: `Unknown questionId: ${r.questionId}` }, { status: 400 })
      }
    }

    console.log('[mobile-assessment] Step 2: looking up profile by supabaseUserId')
    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId },
      select: {
        id: true,
        userId: true,
        dateOfBirth: true,
        city: true,
        seekingGender: true,
        relationshipGoal: true,
      },
    })
    if (!profile) {
      console.log('[mobile-assessment] Step 2: profile not found for supabaseUserId =', supabaseUserId)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    console.log('[mobile-assessment] Step 2 OK: profileId =', profile.id)

    console.log('[mobile-assessment] Step 3: creating Assessment record with responses')
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
    console.log('[mobile-assessment] Step 3 OK: Assessment created')

    console.log('[mobile-assessment] Step 4: upserting PillarResponse records')
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
    console.log('[mobile-assessment] Step 4 OK: PillarResponses upserted')

    console.log('[mobile-assessment] Step 5: upserting PillarScore records')
    const pillarTotals = new Map<string, { total: number; count: number }>()
    for (const r of responses) {
      const p = Q_TO_PILLAR.get(r.questionId)!
      const cur = pillarTotals.get(p) ?? { total: 0, count: 0 }
      pillarTotals.set(p, { total: cur.total + r.value, count: cur.count + 1 })
    }
    await Promise.all(
      Array.from(pillarTotals.entries()).map(([pillar, { total, count }]) => {
        const selfScore = Math.round(total / count)
        return prisma.pillarScore.upsert({
          where: { profileId_pillar: { profileId: profile.id, pillar: pillar as Pillar } },
          update: { selfScore },
          create: { profileId: profile.id, pillar: pillar as Pillar, selfScore },
        })
      })
    )
    console.log('[mobile-assessment] Step 5 OK: PillarScores upserted')

    console.log('[mobile-assessment] Step 6: conditionally setting isComplete')
    const profileSetupComplete = !!(
      profile.dateOfBirth && profile.city && profile.seekingGender && profile.relationshipGoal
    )
    if (profileSetupComplete) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { isComplete: true, completedAt: new Date() },
      })
      console.log('[mobile-assessment] Step 6 OK: isComplete = true')
    } else {
      console.log('[mobile-assessment] Step 6 SKIPPED: profile setup incomplete, isComplete not set')
    }

    console.log('[mobile-assessment] Step 7: fetching other profiles for match calculation')
    const myAnswers: PillarAnswers = Object.fromEntries(
      responses.map((r) => [r.questionId, r.value])
    )
    const otherProfiles = await prisma.profile.findMany({
      where: {
        id: { not: profile.id },
        isActive: true,
        isComplete: true,
        pillarResponses: { some: {} },
        assessments: { some: {} },
      },
      select: {
        id: true,
        userId: true,
        pillarResponses: { select: { questionId: true, value: true } },
      },
    })
    console.log('[mobile-assessment] Step 7 OK: other profiles count =', otherProfiles.length)

    let matchError: string | null = null
    if (otherProfiles.length > 0) {
      try {
        console.log('[mobile-assessment] Step 7: calculating and upserting matches')
        await Promise.all(
          otherProfiles.flatMap((candidate) => {
            const candidateAnswers: PillarAnswers = Object.fromEntries(
              candidate.pillarResponses.map((r) => [r.questionId, r.value])
            )
            const result = calculateMatch(myAnswers, candidateAnswers)
            const matchData = {
              alignmentScore: result.score,
              alignmentTier: result.tier,
              hardStopTriggered: result.hardStopTriggered,
              hardStopReason: result.hardStopReason ?? null,
              pillarBreakdown: result.pillarBreakdown ?? undefined,
            }
            return [
              prisma.match.upsert({
                where: { senderId_receiverId: { senderId: profile.userId, receiverId: candidate.userId } },
                update: matchData,
                create: { senderId: profile.userId, receiverId: candidate.userId, ...matchData },
              }),
              prisma.match.upsert({
                where: { senderId_receiverId: { senderId: candidate.userId, receiverId: profile.userId } },
                update: matchData,
                create: { senderId: candidate.userId, receiverId: profile.userId, ...matchData },
              }),
            ]
          })
        )
        console.log('[mobile-assessment] Step 7 OK: matches upserted')
      } catch (matchErr) {
        const msg = matchErr instanceof Error ? matchErr.message : String(matchErr)
        const stack = matchErr instanceof Error ? matchErr.stack : undefined
        console.error('[mobile-assessment] Step 7 MATCH ERROR:', msg)
        console.error('[mobile-assessment] Step 7 stack:', stack)
        matchError = msg
      }
    }

    return NextResponse.json({
      success: true,
      matchesCalculated: otherProfiles.length,
      ...(matchError ? { matchError } : {}),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    console.error('[mobile-assessment] CAUGHT ERROR:', message)
    console.error('[mobile-assessment] stack:', stack)
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 })
  }
}
