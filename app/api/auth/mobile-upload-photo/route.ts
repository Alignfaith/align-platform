import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit-memory'
import {
  PROFILE_PHOTOS_BUCKET,
  ALLOWED_IMAGE_TYPES,
  storagePath,
  uploadToStorage,
  StorageUploadError,
} from '@/lib/storage'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

const schema = z.object({
  supabaseUserId: z.string().uuid(),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'mobile-upload-photo').limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    // Step 1: Parse multipart body
    console.log('[mobile-upload-photo] Step 1: parsing multipart body')
    let formData: FormData
    try {
      formData = await req.formData()
    } catch {
      return NextResponse.json({ error: 'Failed to parse file upload' }, { status: 400 })
    }
    console.log('[mobile-upload-photo] Step 1 OK')

    // Step 2: Validate supabaseUserId
    console.log('[mobile-upload-photo] Step 2: validating supabaseUserId')
    const { supabaseUserId } = schema.parse({ supabaseUserId: formData.get('supabaseUserId') })
    console.log('[mobile-upload-photo] Step 2 OK: supabaseUserId =', supabaseUserId)

    // Step 3: Validate photo file
    console.log('[mobile-upload-photo] Step 3: validating photo')
    const file = formData.get('photo') as File | null
    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No photo file provided' }, { status: 400 })
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Please upload a JPEG, PNG, WebP, HEIC, or HEIF image.' },
        { status: 400 }
      )
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Photo must be under 10 MB' }, { status: 413 })
    }
    console.log('[mobile-upload-photo] Step 3 OK: type =', file.type, ', size =', file.size)

    // Step 4: Look up profile and user tier
    console.log('[mobile-upload-photo] Step 4: looking up profile')
    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId },
      select: {
        id: true,
        userId: true,
        user: { select: { tier: true } },
      },
    })
    if (!profile) {
      console.log('[mobile-upload-photo] Step 4: profile not found')
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    console.log('[mobile-upload-photo] Step 4 OK: profileId =', profile.id, ', tier =', profile.user.tier)

    // Step 5: Photo count gate
    console.log('[mobile-upload-photo] Step 5: checking photo count')
    const photoCount = await prisma.photo.count({ where: { profileId: profile.id } })
    const tier = profile.user.tier
    if (tier === 'FREE' && photoCount >= 1) {
      console.log('[mobile-upload-photo] Step 5: FREE tier limit reached, count =', photoCount)
      return NextResponse.json(
        { error: 'FREE tier allows only 1 photo. Upgrade to add more.' },
        { status: 403 }
      )
    }
    if ((tier === 'TIER_1' || tier === 'TIER_2') && photoCount >= 6) {
      console.log('[mobile-upload-photo] Step 5: paid tier limit reached, count =', photoCount)
      return NextResponse.json(
        { error: 'Maximum 6 photos allowed.' },
        { status: 403 }
      )
    }
    console.log('[mobile-upload-photo] Step 5 OK: photoCount =', photoCount, ', tier =', tier)

    // Step 6: Upload to Supabase Storage
    console.log('[mobile-upload-photo] Step 6: uploading to storage')
    const path = storagePath('identity', profile.userId, file.name || 'photo.jpg')
    let url: string
    try {
      url = await uploadToStorage(PROFILE_PHOTOS_BUCKET, path, await file.arrayBuffer(), file.type)
    } catch (e) {
      if (e instanceof StorageUploadError) {
        return NextResponse.json({ error: e.message }, { status: e.httpStatus })
      }
      console.error('[mobile-upload-photo] Storage config error:', e)
      return NextResponse.json({ error: 'Storage is not configured on the server' }, { status: 500 })
    }
    console.log('[mobile-upload-photo] Step 6 OK: url =', url)

    // Step 7: Demote existing primary, create new Photo row
    console.log('[mobile-upload-photo] Step 7: saving photo record')
    let photo: { id: string }
    try {
      await prisma.photo.updateMany({
        where: { profileId: profile.id, isPrimary: true },
        data: { isPrimary: false },
      })
      photo = await prisma.photo.create({
        data: {
          profileId: profile.id,
          url,
          publicId: path,
          isPrimary: true,
          isApproved: false,
          order: 0,
        },
        select: { id: true },
      })
    } catch (e) {
      console.error('[mobile-upload-photo] DB error saving photo:', e)
      return NextResponse.json({ error: 'Failed to save photo record' }, { status: 500 })
    }
    console.log('[mobile-upload-photo] Step 7 OK: photoId =', photo.id)

    return NextResponse.json({ success: true, url, photoId: photo.id })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid supabaseUserId' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    console.error('[mobile-upload-photo] CAUGHT ERROR:', message)
    console.error('[mobile-upload-photo] stack:', stack)
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 })
  }
}
