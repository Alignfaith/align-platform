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

    const where = status === 'ALL' ? {} : { status: status as 'INTRODUCED' | 'DATING' | 'ENGAGED' | 'MARRIED' | 'DECLINED' | 'ARCHIVED' }

    const [items, total] = await Promise.all([
      prisma.matchingServiceMatch.findMany({
        where,
        orderBy: { matchedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.matchingServiceMatch.count({ where }),
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
    const { client1Name, client1Email, client2Name, client2Email, matchedAt, notes } = await req.json()

    if (!client1Name?.trim() || !client1Email?.trim() || !client2Name?.trim() || !client2Email?.trim()) {
      return NextResponse.json({ error: 'Both client names and emails are required' }, { status: 400 })
    }

    const match = await prisma.matchingServiceMatch.create({
      data: {
        client1Name: client1Name.trim(),
        client1Email: client1Email.trim().toLowerCase(),
        client2Name: client2Name.trim(),
        client2Email: client2Email.trim().toLowerCase(),
        matchedAt: matchedAt ? new Date(matchedAt) : new Date(),
        notes: notes?.trim() || null,
      },
    })

    return NextResponse.json(match, { status: 201 })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()
    const { id, status, notes, outcome, client1Name, client1Email, client2Name, client2Email } = await req.json()

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const updated = await prisma.matchingServiceMatch.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
        ...(outcome !== undefined && { outcome: outcome?.trim() || null }),
        ...(client1Name && { client1Name: client1Name.trim() }),
        ...(client1Email && { client1Email: client1Email.trim().toLowerCase() }),
        ...(client2Name && { client2Name: client2Name.trim() }),
        ...(client2Email && { client2Email: client2Email.trim().toLowerCase() }),
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
    await prisma.matchingServiceMatch.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
