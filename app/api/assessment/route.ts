import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ALL_QUESTIONS } from '@/lib/pillar-questions'
import { Pillar } from '@prisma/client'

// GET — return the user's latest completed assessment (or null)
export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
    })
    if (!profile) {
        return NextResponse.json({ assessment: null })
    }

    const latest = await prisma.assessment.findFirst({
        where: { profileId: profile.id },
        orderBy: { completedAt: 'desc' },
        include: {
            responses: {
                orderBy: { questionId: 'asc' },
            },
        },
    })

    // Also return all past assessments (for history)
    const history = await prisma.assessment.findMany({
        where: { profileId: profile.id },
        orderBy: { completedAt: 'desc' },
        select: {
            id: true,
            completedAt: true,
            responses: { select: { pillar: true, value: true } },
        },
    })

    return NextResponse.json({ assessment: latest, history })
}

// POST — save a new assessment (all 30 responses)
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { responses } = body as { responses: { questionId: string; value: number }[] }

    // Validate: must have all 30 question IDs
    const validIds = new Set(ALL_QUESTIONS.map((q) => q.id))
    for (const r of responses) {
        if (!validIds.has(r.questionId)) {
            return NextResponse.json({ error: `Unknown questionId: ${r.questionId}` }, { status: 400 })
        }
        if (r.value < 1 || r.value > 5) {
            return NextResponse.json({ error: 'Values must be 1–5' }, { status: 400 })
        }
    }
    if (responses.length !== 30) {
        return NextResponse.json({ error: 'All 30 responses required' }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
    })
    if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Build a map of questionId → { pillar, value }
    const qMap = new Map(ALL_QUESTIONS.map((q) => [q.id, q.pillar]))

    // 1. Create the Assessment record with all responses
    const assessment = await prisma.assessment.create({
        data: {
            profileId: profile.id,
            responses: {
                create: responses.map((r) => ({
                    questionId: r.questionId,
                    pillar: qMap.get(r.questionId) as Pillar,
                    value: r.value,
                })),
            },
        },
        include: { responses: true },
    })

    // 2. Upsert PillarResponse (latest answers — used for matching)
    await Promise.all(
        responses.map((r) =>
            prisma.pillarResponse.upsert({
                where: { profileId_questionId: { profileId: profile.id, questionId: r.questionId } },
                update: { value: r.value },
                create: {
                    profileId: profile.id,
                    questionId: r.questionId,
                    pillar: qMap.get(r.questionId) as Pillar,
                    value: r.value,
                },
            })
        )
    )

    // 3. Upsert PillarScore (average per pillar — used for matching display)
    const pillarGroups = new Map<Pillar, number[]>()
    for (const r of responses) {
        const pillar = qMap.get(r.questionId) as Pillar
        if (!pillarGroups.has(pillar)) pillarGroups.set(pillar, [])
        pillarGroups.get(pillar)!.push(r.value)
    }

    await Promise.all(
        Array.from(pillarGroups.entries()).map(([pillar, values]) => {
            const avg = Math.round(values.reduce((s, v) => s + v, 0) / values.length)
            return prisma.pillarScore.upsert({
                where: { profileId_pillar: { profileId: profile.id, pillar } },
                update: { selfScore: avg },
                create: { profileId: profile.id, pillar, selfScore: avg },
            })
        })
    )

    return NextResponse.json({ assessment }, { status: 201 })
}
