import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError } from '@/lib/errors'

/**
 * One-shot migration endpoint.
 * Adds stripeCustomerId to User and creates Subscription + AnnouncementRead tables.
 * Safe to call multiple times — uses IF NOT EXISTS / IF NOT EXISTS guards.
 * DELETE THIS ROUTE after migrations are confirmed.
 */
export async function POST() {
  try {
    await requireAdmin()

    const results: string[] = []

    // 1. Add stripeCustomerId to User
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;
    `)
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_stripeCustomerId_key"
      ON "User"("stripeCustomerId");
    `)
    results.push('User.stripeCustomerId — OK')

    // 2. Create Subscription table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Subscription" (
        "id"                   TEXT NOT NULL,
        "userId"               TEXT NOT NULL,
        "stripeSubscriptionId" TEXT NOT NULL,
        "stripeCustomerId"     TEXT NOT NULL,
        "stripePriceId"        TEXT NOT NULL,
        "status"               TEXT NOT NULL,
        "tier"                 "MembershipTier" NOT NULL,
        "cancelAtPeriodEnd"    BOOLEAN NOT NULL DEFAULT false,
        "currentPeriodEnd"     TIMESTAMP(3) NOT NULL,
        "createdAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
      );
    `)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Subscription"
        ADD CONSTRAINT "Subscription_userId_key" UNIQUE ("userId")
        DEFERRABLE INITIALLY DEFERRED;
    `).catch(() => {/* already exists */})
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Subscription"
        ADD CONSTRAINT "Subscription_stripeSubscriptionId_key" UNIQUE ("stripeSubscriptionId")
        DEFERRABLE INITIALLY DEFERRED;
    `).catch(() => {/* already exists */})
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        ALTER TABLE "Subscription"
          ADD CONSTRAINT "Subscription_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Subscription_stripeSubscriptionId_idx"
      ON "Subscription"("stripeSubscriptionId");
    `)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Subscription_stripeCustomerId_idx"
      ON "Subscription"("stripeCustomerId");
    `)
    results.push('Subscription table — OK')

    // 3. Create AnnouncementRead table (added in schema but never migrated)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AnnouncementRead" (
        "id"             TEXT NOT NULL,
        "userId"         TEXT NOT NULL,
        "announcementId" TEXT NOT NULL,
        "readAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "AnnouncementRead_pkey" PRIMARY KEY ("id")
      );
    `)
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "AnnouncementRead_userId_announcementId_key"
      ON "AnnouncementRead"("userId", "announcementId");
    `)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "AnnouncementRead_userId_idx"
      ON "AnnouncementRead"("userId");
    `)
    results.push('AnnouncementRead table — OK')

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('[run-migrations]', error)
    return handleApiError(error)
  }
}
