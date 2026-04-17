import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError } from '@/lib/errors'

const schema = z.object({
  photoId: z.string(),
  action: z.enum(['approve', 'reject']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin()
    const body = await req.json()
    const { photoId, action } = schema.parse(body)

    // Fetch the photo to get profileId (needed to update humanVerified on the profile)
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      select: { id: true, profileId: true },
    })
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    if (action === 'approve') {
      await prisma.photo.update({
        where: { id: photoId },
        data: { isApproved: true, moderatedAt: new Date(), moderatedBy: session.user.id },
      })
      // Mark the user as human-verified on their profile
      await prisma.profile.update({
        where: { id: photo.profileId },
        data: { humanVerified: true },
      })
    } else {
      await prisma.photo.update({
        where: { id: photoId },
        data: { isApproved: false, moderatedAt: new Date(), moderatedBy: session.user.id },
      })
      // Revoke human verification if it was previously granted
      await prisma.profile.update({
        where: { id: photo.profileId },
        data: { humanVerified: false },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
