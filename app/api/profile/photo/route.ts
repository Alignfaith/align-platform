import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import {
  PROFILE_PHOTOS_BUCKET,
  ALLOWED_IMAGE_TYPES,
  storagePath,
  uploadToStorage,
  StorageUploadError,
} from '@/lib/storage'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // ── Profile lookup ────────────────────────────────────────────────────────
  let profile: { id: string } | null
  try {
    profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })
  } catch (e) {
    console.error('[profile/photo] DB error finding profile:', e)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
  if (!profile) {
    return NextResponse.json(
      { error: 'Profile not found — complete profile setup first' },
      { status: 404 }
    )
  }

  // ── Parse upload ──────────────────────────────────────────────────────────
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Failed to parse file upload' }, { status: 400 })
  }

  const file = formData.get('photo') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No photo file provided' }, { status: 400 })
  }

  // ── MIME type validation ──────────────────────────────────────────────────
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'File type not allowed. Please upload a JPEG, PNG, WebP, HEIC, or HEIF image.' },
      { status: 400 }
    )
  }

  // ── Size validation ───────────────────────────────────────────────────────
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Photo must be under 10 MB' }, { status: 413 })
  }

  // ── Upload to Supabase Storage ────────────────────────────────────────────
  const path = storagePath('identity', session.user.id, file.name || 'photo.jpg')
  let url: string
  try {
    url = await uploadToStorage(PROFILE_PHOTOS_BUCKET, path, await file.arrayBuffer(), file.type)
  } catch (e) {
    if (e instanceof StorageUploadError) {
      return NextResponse.json({ error: e.message }, { status: e.httpStatus })
    }
    console.error('[profile/photo] Storage config error:', e)
    return NextResponse.json({ error: 'Storage is not configured on the server' }, { status: 500 })
  }

  // ── Save to Photo table ───────────────────────────────────────────────────
  // Path stored in publicId for reference (e.g. for future deletion)
  try {
    await prisma.photo.updateMany({
      where: { profileId: profile.id, isPrimary: true },
      data: { isPrimary: false },
    })
    await prisma.photo.create({
      data: {
        profileId: profile.id,
        url,
        publicId: path,
        isPrimary: true,
        isApproved: false,
        order: 0,
      },
    })
  } catch (e) {
    console.error('[profile/photo] DB error saving photo:', e)
    return NextResponse.json({ error: 'Failed to save photo record' }, { status: 500 })
  }

  return NextResponse.json({ success: true, url })
}
