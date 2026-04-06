import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { handleApiError, AuthenticationError, NotFoundError } from '@/lib/errors'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new AuthenticationError()

    const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })
    if (!profile) throw new NotFoundError('Profile not found')

    const formData = await req.formData()
    const file = formData.get('photo') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 15MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let url: string
    let publicId: string | null = null

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const { uploadImage } = await import('@/lib/cloudinary')
      const result = await uploadImage(buffer, {
        folder: 'align/identity-photos',
        publicId: `identity_${profile.id}`,
      })
      url = result.url
      publicId = result.publicId
    } else {
      // Fallback: store as base64 data URL (works on any host without Cloudinary)
      url = `data:image/jpeg;base64,${buffer.toString('base64')}`
      publicId = `local_identity_${profile.id}`
    }

    // Use the existing Photo model (available in prod DB — no migration needed).
    // Mark all current primary photos as non-primary, then upsert the new one.
    await prisma.photo.updateMany({
      where: { profileId: profile.id, isPrimary: true },
      data: { isPrimary: false },
    })

    await prisma.photo.create({
      data: {
        profileId: profile.id,
        url,
        publicId,
        isPrimary: true,
        isApproved: false,
        order: 0,
      },
    })

    return NextResponse.json({ success: true, url })
  } catch (error) {
    return handleApiError(error)
  }
}
