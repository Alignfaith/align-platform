import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  PROFILE_PHOTOS_BUCKET,
  ALLOWED_IMAGE_TYPES,
  storagePath,
  uploadToStorage,
  StorageUploadError,
} from '@/lib/storage'

// GET — public, returns approved stories
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = 12
    const skip = (page - 1) * limit

    const [stories, total] = await Promise.all([
      prisma.alignmentStory.findMany({
        where: { status: 'APPROVED' },
        orderBy: { reviewedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          displayName: true,
          photoUrl: true,
          story: true,
          reviewedAt: true,
        },
      }),
      prisma.alignmentStory.count({ where: { status: 'APPROVED' } }),
    ])

    return NextResponse.json({
      stories,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('[GET /api/alignment-stories]', error)
    return NextResponse.json({ error: 'Failed to load stories' }, { status: 500 })
  }
}

// POST — authenticated members submit a story
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'You must be logged in to submit a story' }, { status: 401 })
    }

    const formData = await req.formData()
    const displayName = (formData.get('displayName') as string)?.trim()
    const story = (formData.get('story') as string)?.trim()
    const photo = formData.get('photo') as File | null

    if (!displayName || displayName.length < 1) {
      return NextResponse.json({ error: 'Display name is required' }, { status: 400 })
    }
    if (!story || story.length < 50) {
      return NextResponse.json({ error: 'Story must be at least 50 characters' }, { status: 400 })
    }
    if (story.length > 2000) {
      return NextResponse.json({ error: 'Story must be under 2000 characters' }, { status: 400 })
    }

    // Check for existing pending submission from this user
    const existing = await prisma.alignmentStory.findFirst({
      where: { userId: session.user.id, status: 'PENDING' },
    })
    if (existing) {
      return NextResponse.json({ error: 'You already have a story pending review' }, { status: 409 })
    }

    let photoUrl: string | undefined
    let photoPublicId: string | undefined

    if (photo && photo.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.has(photo.type)) {
        return NextResponse.json(
          { error: 'File type not allowed. Please upload a JPEG, PNG, WebP, HEIC, or HEIF image.' },
          { status: 400 }
        )
      }
      if (photo.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'Photo must be under 10 MB' }, { status: 413 })
      }
      const path = storagePath('stories', session.user.id, photo.name || 'photo.jpg')
      try {
        photoUrl = await uploadToStorage(PROFILE_PHOTOS_BUCKET, path, await photo.arrayBuffer(), photo.type)
        photoPublicId = path
      } catch (e) {
        if (e instanceof StorageUploadError) {
          return NextResponse.json({ error: e.message }, { status: e.httpStatus })
        }
        return NextResponse.json({ error: 'Storage is not configured on the server' }, { status: 500 })
      }
    }

    const record = await prisma.alignmentStory.create({
      data: {
        userId: session.user.id,
        displayName,
        story,
        photoUrl,
        photoPublicId,
      },
    })

    return NextResponse.json({ id: record.id, message: 'Story submitted for review' }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/alignment-stories]', error)
    return NextResponse.json({ error: 'Failed to submit story' }, { status: 500 })
  }
}
