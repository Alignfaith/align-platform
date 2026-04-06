import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError } from '@/lib/errors'

export async function GET() {
  try {
    await requireAdmin()

    // Use the existing Photo model.
    // Identity photos: isPrimary=true, isApproved=false
    // Verification photos: publicId starts with 'verify_' or 'local_verify_', isApproved=false
    const [pendingPhotos, pendingVerifications] = await Promise.all([
      prisma.photo.findMany({
        where: {
          isPrimary: true,
          isApproved: false,
          moderatedAt: null,
        },
        select: {
          id: true,
          url: true,
          createdAt: true,
          profile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              userId: true,
              user: { select: { email: true } },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.photo.findMany({
        where: {
          isPrimary: false,
          isApproved: false,
          moderatedAt: null,
          publicId: { startsWith: 'verify_' },
        },
        select: {
          id: true,
          url: true,
          createdAt: true,
          profile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              userId: true,
              user: { select: { email: true } },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    // Also pick up local_ prefixed verification photos
    const localVerifications = await prisma.photo.findMany({
      where: {
        isPrimary: false,
        isApproved: false,
        moderatedAt: null,
        publicId: { startsWith: 'local_verify_' },
      },
      select: {
        id: true,
        url: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userId: true,
            user: { select: { email: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({
      pendingPhotos,
      pendingVerifications: [...pendingVerifications, ...localVerifications],
    })
  } catch (error) {
    return handleApiError(error)
  }
}
