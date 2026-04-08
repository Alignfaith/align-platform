import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const activeOnly = searchParams.get('active') === 'true'
    const where = activeOnly ? { isActive: true } : {}
    const questions = await prisma.matchingQuestion.findMany({
      where,
      orderBy: [{ category: 'asc' }, { createdAt: 'asc' }],
    })
    return NextResponse.json({ items: questions })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const { text, category } = await req.json()
    if (!text?.trim()) return NextResponse.json({ error: 'Question text is required' }, { status: 400 })
    const q = await prisma.matchingQuestion.create({
      data: { text: text.trim(), category: category?.trim() || null },
    })
    return NextResponse.json(q, { status: 201 })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()
    const { id, text, category, isActive } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    const q = await prisma.matchingQuestion.update({
      where: { id },
      data: {
        ...(text !== undefined && { text: text.trim() }),
        ...(category !== undefined && { category: category?.trim() || null }),
        ...(isActive !== undefined && { isActive }),
      },
    })
    return NextResponse.json(q)
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
    await prisma.matchingQuestion.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
