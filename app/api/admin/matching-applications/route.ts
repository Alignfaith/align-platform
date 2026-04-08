import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = 25
    const skip = (page - 1) * limit
    const status = searchParams.get('status') || 'ALL'

    const where = status === 'ALL' ? {} : { status: status as 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED' }

    const [items, total] = await Promise.all([
      prisma.matchingApplication.findMany({
        where,
        orderBy: { submittedAt: 'desc' },
        skip,
        take: limit,
        include: { user: { select: { email: true } } },
      }),
      prisma.matchingApplication.count({ where }),
    ])

    return NextResponse.json({ items, totalItems: total, totalPages: Math.ceil(total / limit), page })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()
    const { id, status, adminNotes } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const updated = await prisma.matchingApplication.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes: adminNotes?.trim() || null }),
      },
    })
    return NextResponse.json({ id: updated.id, status: updated.status })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
