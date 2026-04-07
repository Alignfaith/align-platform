import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const matches = await prisma.match.findMany({
    where: { senderId: session.user.id },
    orderBy: [{ hardStopTriggered: 'asc' }, { alignmentScore: 'desc' }],
    include: {
      receiver: {
        select: {
          id: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              displayName: true,
              dateOfBirth: true,
              city: true,
              state: true,
              bio: true,
              photos: {
                where: { isPrimary: true, isApproved: true },
                select: { url: true },
                take: 1,
              },
            },
          },
        },
      },
    },
  })

  const result = matches.map((m) => {
    const profile = m.receiver.profile
    const dob = profile?.dateOfBirth
    const age = dob
      ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : null

    return {
      matchId: m.id,
      receiverId: m.receiverId,
      status: m.status,
      alignmentScore: m.alignmentScore,
      alignmentTier: m.alignmentTier,
      hardStopTriggered: m.hardStopTriggered,
      hardStopReason: m.hardStopReason,
      pillarBreakdown: m.pillarBreakdown,
      displayName: profile?.displayName || (profile ? `${profile.firstName} ${profile.lastName.charAt(0)}.` : 'Unknown'),
      age,
      city: profile?.city ?? null,
      state: profile?.state ?? null,
      bio: profile?.bio ?? null,
      photoUrl: profile?.photos?.[0]?.url ?? null,
    }
  })

  return NextResponse.json({ matches: result })
}
