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

const MAX_BYTES = 10 * 1024 * 1024

const schema = z.object({
  supabaseUserId: z.string().uuid(),
  displayName: z.string().min(1, 'Display name is required.').max(50),
  story: z
    .string()
    .min(50, 'Story must be at least 50 characters.')
    .max(2000, 'Story must be under 2000 characters.'),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'mobile-alignment-story').limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    console.log('[mobile-alignment-story] Step 1: parsing multipart body')
    let formData: FormData
    try {
      formData = await req.formData()
    } catch {
      return NextResponse.json({ error: 'Failed to parse request body' }, { status: 400 })
    }
    console.log('[mobile-alignment-story] Step 1 OK')

    console.log('[mobile-alignment-story] Step 2: validating fields')
    const { supabaseUserId, displayName, story } = schema.parse({
      supabaseUserId: formData.get('supabaseUserId'),
      displayName: (formData.get('displayName') as string | null)?.trim(),
      story: (formData.get('story') as string | null)?.trim(),
    })
    console.log('[mobile-alignment-story] Step 2 OK: supabaseUserId =', supabaseUserId)

    console.log('[mobile-alignment-story] Step 3: looking up profile')
    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId },
      select: { id: true, userId: true },
    })
    if (!profile) {
      console.log('[mobile-alignment-story] Step 3: profile not found')
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    console.log('[mobile-alignment-story] Step 3 OK: profileId =', profile.id)

    console.log('[mobile-alignment-story] Step 4: checking for MATCHED match')
    const matchCount = await prisma.match.count({
      where: {
        OR: [{ senderId: profile.userId }, { receiverId: profile.userId }],
        status: 'MATCHED',
      },
    })
    if (matchCount === 0) {
      console.log('[mobile-alignment-story] Step 4: no MATCHED matches')
      return NextResponse.json(
        { error: 'You need at least one successful alignment before sharing a story.' },
        { status: 403 }
      )
    }
    console.log('[mobile-alignment-story] Step 4 OK: matchCount =', matchCount)

    console.log('[mobile-alignment-story] Step 5: checking for duplicate pending submission')
    const existing = await prisma.alignmentStory.findFirst({
      where: { userId: profile.userId, status: 'PENDING' },
    })
    if (existing) {
      console.log('[mobile-alignment-story] Step 5: duplicate pending found')
      return NextResponse.json(
        { error: 'You already have a story pending review.' },
        { status: 409 }
      )
    }
    console.log('[mobile-alignment-story] Step 5 OK')

    console.log('[mobile-alignment-story] Step 6: handling optional photo')
    let photoUrl: string | undefined
    let photoPublicId: string | undefined

    const file = formData.get('photo') as File | null
    if (file && file.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: 'File type not allowed. Please upload a JPEG, PNG, WebP, HEIC, or HEIF image.' },
          { status: 400 }
        )
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: 'Photo must be under 10 MB' }, { status: 413 })
      }
      const path = storagePath('stories', profile.userId, file.name || 'story-photo.jpg')
      try {
        photoUrl = await uploadToStorage(
          PROFILE_PHOTOS_BUCKET,
          path,
          await file.arrayBuffer(),
          file.type
        )
        photoPublicId = path
      } catch (e) {
        if (e instanceof StorageUploadError) {
          return NextResponse.json({ error: e.message }, { status: e.httpStatus })
        }
        console.error('[mobile-alignment-story] storage error:', e)
        return NextResponse.json({ error: 'Storage is not configured on the server' }, { status: 500 })
      }
    }
    console.log('[mobile-alignment-story] Step 6 OK: hasPhoto =', !!photoUrl)

    console.log('[mobile-alignment-story] Step 7: creating story record')
    const record = await prisma.alignmentStory.create({
      data: { userId: profile.userId, displayName, story, photoUrl, photoPublicId },
    })
    console.log('[mobile-alignment-story] Step 7 OK: id =', record.id)

    return NextResponse.json({ id: record.id, message: 'Story submitted for review' }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? 'Invalid request' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    console.error('[mobile-alignment-story] CAUGHT ERROR:', message)
    console.error('[mobile-alignment-story] stack:', stack)
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 })
  }
}
