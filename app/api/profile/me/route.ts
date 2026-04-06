import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { handleApiError, AuthenticationError } from '@/lib/errors'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new AuthenticationError()

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        displayName: true,
        bio: true,
        city: true,
        state: true,
        country: true,
        relationshipGoal: true,
        // Primary photo via the existing Photo model (no migration needed)
        photos: {
          where: { isPrimary: true },
          select: { url: true, isApproved: true, publicId: true },
          take: 1,
        },
      },
    })

    if (!profile) return NextResponse.json({})

    const primaryPhoto = profile.photos[0] ?? null

    return NextResponse.json({
      id: profile.id,
      displayName: profile.displayName,
      bio: profile.bio,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      relationshipGoal: profile.relationshipGoal,
      // Shape expected by profile edit page
      identityPhotoUrl: primaryPhoto?.url ?? null,
      identityPhotoApproved: primaryPhoto?.isApproved ?? false,
      // Human verification: not yet in prod DB — return safe defaults
      humanVerified: false,
      humanVerificationPhotoUrl: null,
      humanVerificationSubmittedAt: null,
      // profession/education not in prod DB yet — return empty strings
      profession: '',
      education: '',
    })
  } catch (error) {
    return handleApiError(error)
  }
}
