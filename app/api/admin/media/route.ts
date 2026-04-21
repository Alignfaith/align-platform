import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError } from '@/lib/errors'

export interface MediaItem {
  id: string
  sourceType: 'growth-post' | 'alignment-story' | 'profile-photo' | 'matching-application'
  imageUrl: string
  authorName: string | null
  authorEmail: string
  pillar: string | null
  createdAt: string
}

export interface MediaStats {
  total: number
  thisWeek: number
  bySource: Record<string, number>
}

function weekAgo() {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d
}

function cutoff(period: string) {
  if (period === '7d') return weekAgo()
  if (period === '30d') {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d
  }
  return undefined
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const source = searchParams.get('source') || 'all'
    const period = searchParams.get('period') || 'all'
    const search = searchParams.get('search') || ''
    const statsOnly = searchParams.get('stats') === '1'

    const since = cutoff(period)

    // ── Stats (always fetched from full dataset, ignoring period/search) ──
    if (statsOnly) {
      const [gpTotal, gpWeek, stTotal, stWeek, ppTotal, ppWeek, maTotal, maWeek] = await Promise.all([
        prisma.growthPost.count({ where: { imageUrl: { not: null } } }),
        prisma.growthPost.count({ where: { imageUrl: { not: null }, createdAt: { gte: weekAgo() } } }),
        prisma.alignmentStory.count({ where: { photoUrl: { not: null } } }),
        prisma.alignmentStory.count({ where: { photoUrl: { not: null }, createdAt: { gte: weekAgo() } } }),
        prisma.photo.count(),
        prisma.photo.count({ where: { createdAt: { gte: weekAgo() } } }),
        prisma.matchingApplication.count({ where: { photoUrl: { not: null } } }),
        prisma.matchingApplication.count({ where: { photoUrl: { not: null }, submittedAt: { gte: weekAgo() } } }),
      ])

      const stats: MediaStats = {
        total: gpTotal + stTotal + ppTotal + maTotal,
        thisWeek: gpWeek + stWeek + ppWeek + maWeek,
        bySource: {
          'Growth Post': gpTotal,
          'Alignment Story': stTotal,
          'Profile Photo': ppTotal,
          'Matching Application': maTotal,
        },
      }
      return NextResponse.json(stats)
    }

    // ── Build search filter ────────────────────────────────────────────────
    const nameFilter = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined
    const emailFilter = search
      ? { contains: search, mode: 'insensitive' as const }
      : undefined

    const items: MediaItem[] = []

    // ── Growth Posts ──────────────────────────────────────────────────────
    if (source === 'all' || source === 'growth-post') {
      const where: Record<string, unknown> = { imageUrl: { not: null } }
      if (since) where.createdAt = { gte: since }
      if (search) {
        where.profile = {
          OR: [
            ...(nameFilter ? [nameFilter] : []),
            { user: { email: emailFilter } },
          ],
        }
      }

      const posts = await prisma.growthPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 200,
        select: {
          id: true,
          imageUrl: true,
          pillar: true,
          createdAt: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              user: { select: { email: true } },
            },
          },
        },
      })

      for (const p of posts) {
        if (!p.imageUrl) continue
        items.push({
          id: `gp-${p.id}`,
          sourceType: 'growth-post',
          imageUrl: p.imageUrl,
          authorName: [p.profile.firstName, p.profile.lastName].filter(Boolean).join(' ') || null,
          authorEmail: p.profile.user.email,
          pillar: p.pillar,
          createdAt: p.createdAt.toISOString(),
        })
      }
    }

    // ── Alignment Stories ─────────────────────────────────────────────────
    if (source === 'all' || source === 'alignment-story') {
      const where: Record<string, unknown> = { photoUrl: { not: null } }
      if (since) where.createdAt = { gte: since }
      if (search) {
        where.OR = [
          { displayName: { contains: search, mode: 'insensitive' } },
          { user: { email: emailFilter } },
        ]
      }

      const stories = await prisma.alignmentStory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 200,
        select: {
          id: true,
          photoUrl: true,
          displayName: true,
          createdAt: true,
          user: { select: { email: true } },
        },
      })

      for (const s of stories) {
        if (!s.photoUrl) continue
        items.push({
          id: `as-${s.id}`,
          sourceType: 'alignment-story',
          imageUrl: s.photoUrl,
          authorName: s.displayName || null,
          authorEmail: s.user.email,
          pillar: null,
          createdAt: s.createdAt.toISOString(),
        })
      }
    }

    // ── Profile Photos ────────────────────────────────────────────────────
    if (source === 'all' || source === 'profile-photo') {
      const where: Record<string, unknown> = {}
      if (since) where.createdAt = { gte: since }
      if (search) {
        where.profile = {
          OR: [
            ...(nameFilter ? [nameFilter] : []),
            { user: { email: emailFilter } },
          ],
        }
      }

      const photos = await prisma.photo.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 200,
        select: {
          id: true,
          url: true,
          createdAt: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              user: { select: { email: true } },
            },
          },
        },
      })

      for (const ph of photos) {
        items.push({
          id: `pp-${ph.id}`,
          sourceType: 'profile-photo',
          imageUrl: ph.url,
          authorName: [ph.profile.firstName, ph.profile.lastName].filter(Boolean).join(' ') || null,
          authorEmail: ph.profile.user.email,
          pillar: null,
          createdAt: ph.createdAt.toISOString(),
        })
      }
    }

    // ── Matching Applications ─────────────────────────────────────────────
    if (source === 'all' || source === 'matching-application') {
      const where: Record<string, unknown> = { photoUrl: { not: null } }
      if (since) where.submittedAt = { gte: since }
      if (search) {
        where.user = {
          OR: [
            { email: emailFilter },
            {
              profile: {
                OR: nameFilter ? [nameFilter] : [],
              },
            },
          ],
        }
      }

      const apps = await prisma.matchingApplication.findMany({
        where,
        orderBy: { submittedAt: 'desc' },
        take: 200,
        select: {
          id: true,
          photoUrl: true,
          submittedAt: true,
          user: {
            select: {
              email: true,
              profile: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      })

      for (const a of apps) {
        if (!a.photoUrl) continue
        const profile = a.user.profile
        items.push({
          id: `ma-${a.id}`,
          sourceType: 'matching-application',
          imageUrl: a.photoUrl,
          authorName: profile
            ? [profile.firstName, profile.lastName].filter(Boolean).join(' ') || null
            : null,
          authorEmail: a.user.email,
          pillar: null,
          createdAt: a.submittedAt.toISOString(),
        })
      }
    }

    // Sort combined results newest-first
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ items, total: items.length })
  } catch (error) {
    return handleApiError(error)
  }
}
