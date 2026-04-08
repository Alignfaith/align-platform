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

    const where = status === 'ALL' ? {} : { status: status as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' }

    const [items, total] = await Promise.all([
      prisma.matchingInterview.findMany({
        where,
        orderBy: { scheduledAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.matchingInterview.count({ where }),
    ])

    return NextResponse.json({ items, totalItems: total, totalPages: Math.ceil(total / limit), page })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const { clientName, clientEmail, clientPhone, scheduledAt, notes, inquiryId } = await req.json()

    if (!clientName?.trim() || !clientEmail?.trim()) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const interview = await prisma.matchingInterview.create({
      data: {
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim().toLowerCase(),
        clientPhone: clientPhone?.trim() || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        notes: notes?.trim() || null,
        inquiryId: inquiryId || null,
      },
    })

    return NextResponse.json(interview, { status: 201 })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()
    const { id, status, notes, scheduledAt, clientName, clientEmail, clientPhone } = await req.json()

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const updated = await prisma.matchingInterview.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
        ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
        ...(clientName && { clientName: clientName.trim() }),
        ...(clientEmail && { clientEmail: clientEmail.trim().toLowerCase() }),
        ...(clientPhone !== undefined && { clientPhone: clientPhone?.trim() || null }),
      },
    })

    return NextResponse.json(updated)
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await prisma.matchingInterview.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
