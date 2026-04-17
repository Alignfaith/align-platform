import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
    _req: Request,
    { params }: { params: { matchId: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const match = await prisma.match.findUnique({
        where: { id: params.matchId },
        include: {
            receiver: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            displayName: true,
                            firstName: true,
                            lastName: true,
                            dateOfBirth: true,
                            city: true,
                            state: true,
                            bio: true,
                            aboutMe: true,
                            profession: true,
                            education: true,
                            relationshipGoal: true,
                            photos: {
                                where: { isApproved: true },
                                select: { url: true, isPrimary: true, order: true },
                                orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
                            },
                            pillarResponses: {
                                select: { questionId: true, pillar: true, value: true },
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

    // Only the sender may view — receiver viewing their own match record is not supported here
    if (match.senderId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch tier from DB to avoid stale session data
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { tier: true },
    })
    const isPaid = user?.tier !== 'FREE'

    const profile = match.receiver.profile
    const dob = profile?.dateOfBirth
    const age = dob
        ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : null

    return NextResponse.json({
        matchId: match.id,
        status: match.status,
        alignmentScore: match.alignmentScore,
        alignmentTier: match.alignmentTier,
        hardStopTriggered: match.hardStopTriggered,
        hardStopReason: match.hardStopReason,
        pillarBreakdown: match.pillarBreakdown,
        profile: {
            displayName: profile?.displayName
                || (profile ? `${profile.firstName} ${profile.lastName.charAt(0)}.` : 'Unknown'),
            age,
            city: profile?.city ?? null,
            state: profile?.state ?? null,
            bio: profile?.bio ?? null,
            aboutMe: profile?.aboutMe ?? null,
            profession: profile?.profession ?? null,
            education: profile?.education ?? null,
            relationshipGoal: profile?.relationshipGoal ?? null,
            photos: profile?.photos ?? [],
            // Only include individual question answers for paid members
            pillarResponses: isPaid ? (profile?.pillarResponses ?? []) : [],
        },
    })
}
