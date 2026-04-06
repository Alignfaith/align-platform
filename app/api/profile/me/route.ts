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
        profession: true,
        education: true,
        relationshipGoal: true,
        identityPhotoUrl: true,
        identityPhotoApproved: true,
        humanVerified: true,
        humanVerificationPhotoUrl: true,
        humanVerificationSubmittedAt: true,
      },
    })

    return NextResponse.json(profile ?? {})
  } catch (error) {
    return handleApiError(error)
  }
}
