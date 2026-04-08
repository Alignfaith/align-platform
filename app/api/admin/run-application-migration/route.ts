import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

// One-shot migration — run once, then delete this file.
export async function POST() {
  try {
    await requireAdmin()

    try {
      await prisma.$executeRawUnsafe(
        `CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED')`
      )
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? ''
      if (!msg.includes('already exists')) throw e
    }

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "MatchingApplication" (
        "id"                        TEXT NOT NULL,
        "userId"                    TEXT NOT NULL,
        "isChristian"               BOOLEAN NOT NULL,
        "denomination"              TEXT,
        "churchFrequency"           TEXT NOT NULL,
        "maritalStatus"             TEXT NOT NULL,
        "dateOfBirth"               TIMESTAMP(3) NOT NULL,
        "age"                       INTEGER NOT NULL,
        "hasChildren"               BOOLEAN NOT NULL,
        "childrenCount"             INTEGER,
        "children"                  JSONB,
        "openToPartnerChildren"     TEXT NOT NULL,
        "openToPartnerChildrenOther" TEXT,
        "city"                      TEXT NOT NULL,
        "state"                     TEXT NOT NULL,
        "willingToRelocate"         TEXT NOT NULL,
        "homeOwnership"             TEXT NOT NULL,
        "householdMembers"          JSONB NOT NULL DEFAULT '[]',
        "pets"                      TEXT NOT NULL DEFAULT '',
        "profession"                TEXT NOT NULL,
        "incomeRange"               TEXT NOT NULL,
        "fitnessLevel"              TEXT NOT NULL,
        "lookingToMarry"            TEXT NOT NULL,
        "marriageTimeline"          TEXT NOT NULL,
        "appearanceDescription"     TEXT NOT NULL,
        "partnerPhysicalAttrs"      TEXT NOT NULL,
        "nonNegotiables"            TEXT NOT NULL,
        "conflictHandling"          TEXT NOT NULL,
        "idealPartnership"          TEXT NOT NULL,
        "photoUrl"                  TEXT,
        "photoPublicId"             TEXT,
        "status"                    "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
        "adminNotes"                TEXT,
        "submittedAt"               TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"                 TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "MatchingApplication_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "MatchingApplication_userId_key" UNIQUE ("userId"),
        CONSTRAINT "MatchingApplication_userId_fkey" FOREIGN KEY ("userId")
          REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `)

    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "MatchingApplication_status_idx" ON "MatchingApplication"("status")`)
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "MatchingApplication_submittedAt_idx" ON "MatchingApplication"("submittedAt")`)

    return NextResponse.json({ ok: true, message: 'MatchingApplication table created successfully' })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) return NextResponse.json({ error: err.message }, { status: err.statusCode })
    console.error('[run-application-migration]', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
