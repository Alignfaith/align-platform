import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

// One-shot migration — run once, then delete this file.
export async function POST() {
  try {
    await requireAdmin()

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "MatchingQuestion" (
        "id"        TEXT NOT NULL,
        "text"      TEXT NOT NULL,
        "category"  TEXT,
        "isActive"  BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "MatchingQuestion_pkey" PRIMARY KEY ("id")
      )
    `)

    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "MatchingQuestion_isActive_idx" ON "MatchingQuestion"("isActive")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "MatchingQuestion_category_idx" ON "MatchingQuestion"("category")`)

    return NextResponse.json({ ok: true, message: 'MatchingQuestion table created successfully' })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    console.error('[run-questions-migration]', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
