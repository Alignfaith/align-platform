import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

// One-shot migration — run once, then delete this file.
export async function POST() {
  try {
    await requireAdmin()

    // InterviewStatus enum
    try {
      await prisma.$executeRawUnsafe(
        `CREATE TYPE "InterviewStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')`
      )
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? ''
      if (!msg.includes('already exists')) throw e
    }

    // MatchingMatchStatus enum
    try {
      await prisma.$executeRawUnsafe(
        `CREATE TYPE "MatchingMatchStatus" AS ENUM ('INTRODUCED', 'DATING', 'ENGAGED', 'MARRIED', 'DECLINED', 'ARCHIVED')`
      )
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? ''
      if (!msg.includes('already exists')) throw e
    }

    // MatchingInterview table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "MatchingInterview" (
        "id"          TEXT NOT NULL,
        "clientName"  TEXT NOT NULL,
        "clientEmail" TEXT NOT NULL,
        "clientPhone" TEXT,
        "scheduledAt" TIMESTAMP(3),
        "status"      "InterviewStatus" NOT NULL DEFAULT 'SCHEDULED',
        "notes"       TEXT,
        "inquiryId"   TEXT,
        "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "MatchingInterview_pkey" PRIMARY KEY ("id")
      )
    `)

    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "MatchingInterview_status_idx" ON "MatchingInterview"("status")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "MatchingInterview_scheduledAt_idx" ON "MatchingInterview"("scheduledAt")`)

    // MatchingServiceMatch table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "MatchingServiceMatch" (
        "id"           TEXT NOT NULL,
        "client1Name"  TEXT NOT NULL,
        "client1Email" TEXT NOT NULL,
        "client2Name"  TEXT NOT NULL,
        "client2Email" TEXT NOT NULL,
        "matchedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "status"       "MatchingMatchStatus" NOT NULL DEFAULT 'INTRODUCED',
        "notes"        TEXT,
        "outcome"      TEXT,
        "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "MatchingServiceMatch_pkey" PRIMARY KEY ("id")
      )
    `)

    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "MatchingServiceMatch_status_idx" ON "MatchingServiceMatch"("status")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "MatchingServiceMatch_matchedAt_idx" ON "MatchingServiceMatch"("matchedAt")`)

    return NextResponse.json({ ok: true, message: 'MatchingInterview and MatchingServiceMatch tables created' })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    console.error('[run-matching-migration]', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
