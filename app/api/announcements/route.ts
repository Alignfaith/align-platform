import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const tier = session.user.tier as string | undefined

  // Map user tier to announcement targets that apply to them
  const tierTarget =
    tier === 'TIER_1' ? 'TIER_1' :
    tier === 'TIER_2' ? 'TIER_2' :
    'FREE_TIER'

  // Fetch user gender for gender-targeted announcements
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { gender: true },
  })
  const genderTarget = profile?.gender === 'MALE' ? 'MALE' : profile?.gender === 'FEMALE' ? 'FEMALE' : null

  const applicableTargets = ['ALL_USERS', tierTarget, ...(genderTarget ? [genderTarget] : [])]

  const now = new Date()

  const [announcements, readRows] = await Promise.all([
    prisma.announcement.findMany({
      where: {
        isActive: true,
        target: { in: applicableTargets as any },
        startsAt: { lte: now },
        OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.announcementRead.findMany({
      where: { userId },
      select: { announcementId: true },
    }),
  ])

  const readIds = new Set(readRows.map((r) => r.announcementId))

  const result = announcements.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    createdAt: a.createdAt,
    isRead: readIds.has(a.id),
  }))

  return NextResponse.json({ announcements: result })
}
