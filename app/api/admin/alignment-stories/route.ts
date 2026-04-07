import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

// GET — admin: list stories with filter + pagination
export async function GET(req: NextRequest) {
  try {
    const session = await requireAdmin()
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = 20
    const skip = (page - 1) * limit
    const status = searchParams.get('status') || 'PENDING'

    const where = status === 'ALL' ? {} : { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' }

    const [stories, total] = await Promise.all([
      prisma.alignmentStory.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { email: true } },
        },
      }),
      prisma.alignmentStory.count({ where }),
    ])

    return NextResponse.json({
      items: stories,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      page,
    })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode })
    }
    console.error('[GET /api/admin/alignment-stories]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH — admin: approve or reject a story
export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAdmin()
    const { id, action, rejectionReason } = await req.json()

    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const story = await prisma.alignmentStory.findUnique({ where: { id } })
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    const updated = await prisma.alignmentStory.update({
      where: { id },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        rejectionReason: action === 'reject' ? (rejectionReason || null) : null,
      },
    })

    return NextResponse.json({ id: updated.id, status: updated.status })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode })
    }
    console.error('[PATCH /api/admin/alignment-stories]', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
