import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { AuthenticationError, NotFoundError } from '@/lib/errors'

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // 2. Find profile
    let profile
    try {
      profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })
    } catch (e: unknown) {
      console.error('[photo] DB error finding profile:', e)
      return NextResponse.json({ error: 'Database error looking up profile' }, { status: 500 })
    }
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found — complete profile setup first' }, { status: 404 })
    }

    // 3. Parse upload
    let formData: FormData
    try {
      formData = await req.formData()
    } catch (e: unknown) {
      console.error('[photo] formData parse error:', e)
      return NextResponse.json({ error: 'Failed to parse file upload' }, { status: 400 })
    }

    const file = formData.get('photo') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No photo file provided' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Photo must be under 10 MB' }, { status: 400 })
    }

    // 4. Convert to buffer
    let buffer: Buffer
    try {
      buffer = Buffer.from(await file.arrayBuffer())
    } catch (e: unknown) {
      console.error('[photo] buffer conversion error:', e)
      return NextResponse.json({ error: 'Failed to read uploaded file' }, { status: 500 })
    }

    // 5. Store image
    let url: string
    let publicId: string

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const { uploadImage } = await import('@/lib/cloudinary')
        const result = await uploadImage(buffer, {
          folder: 'align/identity-photos',
          publicId: `identity_${profile.id}`,
        })
        url = result.url
        publicId = result.publicId
      } catch (e: unknown) {
        console.error('[photo] Cloudinary upload error:', e)
        return NextResponse.json({ error: 'Image upload service failed' }, { status: 500 })
      }
    } else {
      // No Cloudinary — store as compact base64 data URL.
      // The client already resizes to ≤800px / 82% JPEG so this stays under ~200KB.
      url = `data:image/jpeg;base64,${buffer.toString('base64')}`
      publicId = `local_${profile.id}`
    }

    // 6. Save to Photo table (existing in prod DB — no migration needed)
    try {
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
    } catch (e: unknown) {
      console.error('[photo] DB error saving photo:', e)
      return NextResponse.json({ error: 'Failed to save photo — database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, url })
  } catch (e: unknown) {
    console.error('[photo] Unexpected error:', e)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
