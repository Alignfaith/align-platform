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

    if (action === 'approve') {
      await prisma.photo.update({
        where: { id: photoId },
        data: { isApproved: true, moderatedAt: new Date(), moderatedBy: session.user.id },
      })
    } else {
      await prisma.photo.update({
        where: { id: photoId },
        data: { moderatedAt: new Date(), moderatedBy: session.user.id },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
