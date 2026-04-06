import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { handleApiError, NotFoundError } from '@/lib/errors'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            photos: { orderBy: { order: 'asc' } },
            pillarScores: true,
            pillarResponses: { orderBy: { questionId: 'asc' } },
            reflections: { orderBy: { questionId: 'asc' } },
            growthPosts: { orderBy: { createdAt: 'desc' } },
            assessments: {
              orderBy: { completedAt: 'desc' },
              include: {
                responses: { orderBy: { questionId: 'asc' } },
              },
            },
          },
        },
        sentMatches: {
          take: 50,
          orderBy: { createdAt: 'desc' },
          select: { id: true, status: true, receiverId: true, createdAt: true, matchedAt: true },
        },
        receivedMatches: {
          take: 50,
          orderBy: { createdAt: 'desc' },
          select: { id: true, status: true, senderId: true, createdAt: true, matchedAt: true },
        },
        adminActionsReceived: {
          orderBy: { createdAt: 'desc' },
          include: {
            admin: { select: { email: true } },
          },
        },
        reportsReceived: { orderBy: { createdAt: 'desc' } },
        reportsSubmitted: { orderBy: { createdAt: 'desc' } },
        appeals: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return NextResponse.json(user)
  } catch (error) {
    return handleApiError(error)
  }
}
