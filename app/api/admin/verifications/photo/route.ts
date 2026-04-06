import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError } from '@/lib/errors'

const schema = z.object({
  profileId: z.string(),
  action: z.enum(['approve', 'reject']),
})

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const { profileId, action } = schema.parse(body)

    if (action === 'approve') {
      await prisma.profile.update({
        where: { id: profileId },
        data: { identityPhotoApproved: true },
      })
    } else {
      await prisma.profile.update({
        where: { id: profileId },
        data: {
          identityPhotoUrl: null,
          identityPhotoApproved: false,
          identityPhotoSubmittedAt: null,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
