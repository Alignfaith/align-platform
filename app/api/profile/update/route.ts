import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { handleApiError, AuthenticationError, NotFoundError } from '@/lib/errors'

const updateSchema = z.object({
  displayName: z.string().max(60).optional(),
  bio: z.string().max(1000).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  profession: z.string().max(100).optional(),
  education: z.string().max(100).optional(),
  relationshipGoal: z.enum(['MARRIAGE', 'SERIOUS_DATING', 'DISCERNING']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new AuthenticationError()

    const body = await req.json()
    const data = updateSchema.parse(body)

    const existing = await prisma.profile.findUnique({ where: { userId: session.user.id } })
    if (!existing) throw new NotFoundError('Profile not found')

    const updated = await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        displayName: data.displayName || null,
        bio: data.bio || null,
        city: data.city,
        state: data.state,
        country: data.country,
        profession: data.profession || null,
        education: data.education || null,
        relationshipGoal: data.relationshipGoal,
      },
    })

    return NextResponse.json({ success: true, profile: { id: updated.id } })
  } catch (error) {
    return handleApiError(error)
  }
}
