import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError } from '@/lib/errors'

export async function GET() {
  try {
    await requireAdmin()

    const [pendingPhotos, pendingVerifications] = await Promise.all([
      // Identity photos awaiting approval
      prisma.profile.findMany({
        where: {
          identityPhotoUrl: { not: null },
          identityPhotoApproved: false,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          identityPhotoUrl: true,
          identityPhotoSubmittedAt: true,
          userId: true,
          user: { select: { email: true } },
        },
        orderBy: { identityPhotoSubmittedAt: 'asc' },
      }),
      // Human verifications awaiting review
      prisma.profile.findMany({
        where: {
          humanVerificationPhotoUrl: { not: null },
          humanVerified: false,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          humanVerificationPhotoUrl: true,
          humanVerificationSubmittedAt: true,
          userId: true,
          user: { select: { email: true, name: true } },
        },
        orderBy: { humanVerificationSubmittedAt: 'asc' },
      }),
    ])

    return NextResponse.json({ pendingPhotos, pendingVerifications })
  } catch (error) {
    return handleApiError(error)
  }
}
