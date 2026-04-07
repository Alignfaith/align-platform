import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

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

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Photo must be under 10 MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    let url: string

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const { uploadImage } = await import('@/lib/cloudinary')
      const result = await uploadImage(buffer, {
        folder: 'align/growth-posts',
        publicId: `growth_${profile.id}_${Date.now()}`,
      })
      url = result.url
    } else {
      url = `data:image/jpeg;base64,${buffer.toString('base64')}`
    }

    return NextResponse.json({ success: true, url })
  } catch (e: unknown) {
    console.error('[growth-posts/photo] Unexpected error:', e)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
