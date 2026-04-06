import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { handleApiError, AuthenticationError, NotFoundError } from '@/lib/errors'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new AuthenticationError()

    const existing = await prisma.profile.findUnique({ where: { userId: session.user.id } })
    if (!existing) throw new NotFoundError('Profile not found')

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

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      // Upload to Cloudinary
      const { uploadImage } = await import('@/lib/cloudinary')
      const result = await uploadImage(buffer, {
        folder: 'align/identity-photos',
        publicId: `identity_${existing.id}`,
      })
      url = result.url
    } else {
      // Fallback: store as base64 data URL
      url = `data:image/jpeg;base64,${buffer.toString('base64')}`
    }

    await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        identityPhotoUrl: url,
        identityPhotoApproved: false,
        identityPhotoSubmittedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, url })
  } catch (error) {
    return handleApiError(error)
  }
}
