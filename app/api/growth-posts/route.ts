import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { handleApiError, AuthenticationError, ValidationError } from '@/lib/errors'
import { moderationGate } from '@/lib/moderation-gate'

const growthPostSchema = z.object({
    pillar: z.enum(['SPIRITUAL', 'MENTAL', 'PHYSICAL', 'FINANCIAL', 'APPEARANCE', 'INTIMACY']),
    content: z.string().min(10, 'Reflection must be at least 10 characters').max(2000),
    imageUrl: z.string().url().optional().or(z.literal('')),
})

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            throw new AuthenticationError()
        }

        const body = await req.json()
        const data = growthPostSchema.parse(body)

        // AI moderation check
        const mod = await moderationGate(data.content, 'reflection')
        if (mod.blocked) {
            throw new ValidationError(mod.reason)
        }

        // Find user profile
        const profile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
        })

        if (!profile) {
            throw new ValidationError('Profile not found.')
        }

        // Create the growth post
        const post = await prisma.growthPost.create({
            data: {
                profileId: profile.id,
                pillar: data.pillar,
                content: data.content,
                imageUrl: data.imageUrl || null,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Growth post created successfully',
            post,
        })
    } catch (error) {
        return handleApiError(error)
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            throw new AuthenticationError()
        }

        const { searchParams } = new URL(req.url)
        const pillar = searchParams.get('pillar') as any
        const limit = parseInt(searchParams.get('limit') || '10')

        const posts = await prisma.growthPost.findMany({
            where: {
                profile: {
                    userId: session.user.id
                },
                ...(pillar && { pillar }),
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        })

        return NextResponse.json({
            success: true,
            posts,
        })
    } catch (error) {
        return handleApiError(error)
    }
}
