import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit-memory'

const schema = z.object({
  supabaseUserId: z.string().uuid(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'mobile-conversation').limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    console.log('[mobile-conversation] Step 1: params')
    const { supabaseUserId } = schema.parse({
      supabaseUserId: req.nextUrl.searchParams.get('supabaseUserId'),
    })
    const { id: conversationId } = await params
    console.log('[mobile-conversation] Step 1 OK: conversationId =', conversationId)

    console.log('[mobile-conversation] Step 2: looking up profile')
    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId },
      select: { userId: true },
    })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    console.log('[mobile-conversation] Step 2 OK: userId =', profile.userId)

    console.log('[mobile-conversation] Step 3: loading conversation')
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        participants: {
          select: {
            userId: true,
            user: {
              select: {
                profile: {
                  select: {
                    firstName: true,
                    photos: {
                      where: { isPrimary: true, isApproved: true },
                      take: 1,
                      select: { url: true },
                    },
                  },
                },
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
          },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const me = conversation.participants.find((p) => p.userId === profile.userId)
    if (!me) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.log('[mobile-conversation] Step 3 OK: messages =', conversation.messages.length)

    const other = conversation.participants.find((p) => p.userId !== profile.userId)
    const otherProfile = other?.user?.profile

    return NextResponse.json({
      otherName: otherProfile?.firstName ?? 'Your match',
      otherPhotoUrl: otherProfile?.photos[0]?.url ?? null,
      messages: conversation.messages.map((m) => ({
        id: m.id,
        content: m.content,
        isOwn: m.senderId === profile.userId,
        createdAt: m.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid supabaseUserId' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    console.error('[mobile-conversation] CAUGHT ERROR:', message)
    console.error('[mobile-conversation] stack:', stack)
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 })
  }
}
