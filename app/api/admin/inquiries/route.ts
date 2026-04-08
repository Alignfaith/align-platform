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

    const where = status === 'ALL' ? {} : { status: status as 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED' }

    const [items, total] = await Promise.all([
      prisma.inquiry.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.inquiry.count({ where }),
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
    const { id, status } = await req.json()
    if (!id || !['NEW', 'READ', 'REPLIED', 'ARCHIVED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const updated = await prisma.inquiry.update({ where: { id }, data: { status } })
    return NextResponse.json({ id: updated.id, status: updated.status })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
