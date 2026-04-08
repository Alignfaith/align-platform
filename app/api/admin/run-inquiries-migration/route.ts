import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

// One-shot migration — run once, then delete this file.
export async function POST() {
  try {
    await requireAdmin()

    try {
      await prisma.$executeRawUnsafe(
        `CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED')`
      )
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? ''
      if (!msg.includes('already exists')) throw e
    }

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Inquiry" (
        "id"        TEXT NOT NULL,
        "name"      TEXT NOT NULL,
        "email"     TEXT NOT NULL,
        "phone"     TEXT,
        "message"   TEXT NOT NULL,
        "status"    "InquiryStatus" NOT NULL DEFAULT 'NEW',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
      )
    `)

    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS "Inquiry_status_idx" ON "Inquiry"("status")`
    )
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS "Inquiry_createdAt_idx" ON "Inquiry"("createdAt")`
    )

    return NextResponse.json({ ok: true, message: 'Inquiry table created successfully' })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    console.error('[run-inquiries-migration]', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
