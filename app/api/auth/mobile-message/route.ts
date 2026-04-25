import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit-memory'

const schema = z.object({
  supabaseUserId: z.string().uuid(),
  conversationId: z.string().min(1),
  content: z.string().min(1, 'Message cannot be empty.').max(2000, 'Message is too long.'),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'mobile-message').limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    console.log('[mobile-message] Step 1: parsing body')
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const { supabaseUserId, conversationId, content } = schema.parse(body)
    console.log('[mobile-message] Step 1 OK: conversationId =', conversationId)

    console.log('[mobile-message] Step 2: looking up profile')
    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId },
      select: { userId: true },
    })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    console.log('[mobile-message] Step 2 OK: userId =', profile.userId)

    console.log('[mobile-message] Step 3: verifying participant')
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: profile.userId,
        },
      },
    })
    if (!participant) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.log('[mobile-message] Step 3 OK')

    console.log('[mobile-message] Step 4: creating message')
    const message = await prisma.$transaction(async (tx) => {
      const msg = await tx.message.create({
        data: { conversationId, senderId: profile.userId, content },
        select: { id: true, createdAt: true },
      })
      await tx.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: msg.createdAt },
      })
      return msg
    })
    console.log('[mobile-message] Step 4 OK: messageId =', message.id)

    return NextResponse.json({ id: message.id, createdAt: message.createdAt.toISOString() })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? 'Invalid request' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    console.error('[mobile-message] CAUGHT ERROR:', message)
    console.error('[mobile-message] stack:', stack)
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 })
  }
}
