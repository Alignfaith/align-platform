import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { handleApiError, AuthenticationError, NotFoundError } from '@/lib/errors'
import {
  PROFILE_PHOTOS_BUCKET,
  ALLOWED_IMAGE_TYPES,
  storagePath,
  uploadToStorage,
  StorageUploadError,
} from '@/lib/storage'

const MAX_BYTES = 15 * 1024 * 1024 // 15 MB (larger than identity — raw selfie, not resized)

export async function POST(req: NextRequest) {
  try {
    // ── Auth ────────────────────────────────────────────────────────────────
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new AuthenticationError()

    // ── Profile lookup ───────────────────────────────────────────────────────
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })
    if (!profile) throw new NotFoundError('Profile not found')

    // ── Parse upload ─────────────────────────────────────────────────────────
    let formData: FormData
    try {
      formData = await req.formData()
    } catch {
      return NextResponse.json({ error: 'Failed to parse file upload' }, { status: 400 })
    }

    const file = formData.get('photo') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // ── MIME type validation ─────────────────────────────────────────────────
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Please upload a JPEG, PNG, WebP, HEIC, or HEIF image.' },
        { status: 400 }
      )
    }

    // ── Size validation ──────────────────────────────────────────────────────
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image must be under 15 MB' }, { status: 413 })
    }

    // ── Upload to Supabase Storage ───────────────────────────────────────────
    const path = storagePath('verification', session.user.id, file.name || 'verification.jpg')
    let url: string
    try {
      url = await uploadToStorage(PROFILE_PHOTOS_BUCKET, path, await file.arrayBuffer(), file.type)
    } catch (e) {
      if (e instanceof StorageUploadError) {
        return NextResponse.json({ error: e.message }, { status: e.httpStatus })
      }
      console.error('[profile/verification] Storage config error:', e)
      return NextResponse.json({ error: 'Storage is not configured on the server' }, { status: 500 })
    }

    // ── Persist to DB ────────────────────────────────────────────────────────
    // Store in Photo table for admin moderation queue (same as identity photos).
    // Also write humanVerificationPhotoUrl + humanVerificationSubmittedAt to Profile
    // so /api/profile/me can return the real state instead of hardcoded nulls.
    await prisma.photo.create({
      data: {
        profileId: profile.id,
        url,
        publicId: path,      // path prefix 'verification/' distinguishes it from identity photos
        isPrimary: false,
        isApproved: false,
        order: 99,
      },
    })

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        humanVerificationPhotoUrl: url,
        humanVerificationSubmittedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, url })
  } catch (error) {
    return handleApiError(error)
  }
}
