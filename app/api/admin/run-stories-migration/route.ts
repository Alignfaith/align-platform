import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

// One-shot migration — run once, then delete this file.
export async function POST() {
  try {
    await requireAdmin()

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'StoryStatus') THEN
          CREATE TYPE "StoryStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
        END IF;
      END $$;
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AlignmentStory" (
        "id"              TEXT NOT NULL,
        "userId"          TEXT NOT NULL,
        "displayName"     TEXT NOT NULL,
        "photoUrl"        TEXT,
        "photoPublicId"   TEXT,
        "story"           TEXT NOT NULL,
        "status"          "StoryStatus" NOT NULL DEFAULT 'PENDING',
        "reviewedBy"      TEXT,
        "reviewedAt"      TIMESTAMP(3),
        "rejectionReason" TEXT,
        "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "AlignmentStory_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "AlignmentStory_userId_fkey" FOREIGN KEY ("userId")
          REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "AlignmentStory_status_idx" ON "AlignmentStory"("status");
    `)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "AlignmentStory_createdAt_idx" ON "AlignmentStory"("createdAt");
    `)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "AlignmentStory_userId_idx" ON "AlignmentStory"("userId");
    `)

    return NextResponse.json({ ok: true, message: 'AlignmentStory table created successfully' })
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string }
    if (err?.statusCode) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode })
    }
    console.error('[run-stories-migration]', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
