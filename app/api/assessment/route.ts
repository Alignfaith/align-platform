import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
