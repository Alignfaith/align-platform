import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit-memory'

const schema = z.object({
  supabaseUserId: z.string().uuid(),
  matchId: z.string().min(1),
  phase: z.union([z.literal(1), z.literal(2)]),
  decision: z.union([z.literal('APPROVED'), z.literal('DECLINED')]),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'mobile-alignment-consent').limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    console.log('[mobile-alignment-consent] Step 1: parsing body')
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const { supabaseUserId, matchId, phase, decision } = schema.parse(body)
    console.log('[mobile-alignment-consent] Step 1 OK: matchId =', matchId, ', phase =', phase, ', decision =', decision)

    console.log('[mobile-alignment-consent] Step 2: looking up profile')
    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId },
      select: { userId: true },
    })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    console.log('[mobile-alignment-consent] Step 2 OK: userId =', profile.userId)

    console.log('[mobile-alignment-consent] Step 3: loading match')
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        status: true,
        senderPhase1: true,
        receiverPhase1: true,
        senderPhase2: true,
        receiverPhase2: true,
      },
    })
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    const isSender = match.senderId === profile.userId
    const isReceiver = match.receiverId === profile.userId
    if (!isSender && !isReceiver) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (['DECLINED', 'EXPIRED', 'UNMATCHED'].includes(match.status)) {
      return NextResponse.json({ error: 'Match is no longer active' }, { status: 409 })
    }
    console.log('[mobile-alignment-consent] Step 3 OK: isSender =', isSender)

    const myPhase1 = isSender ? match.senderPhase1 : match.receiverPhase1
    const myPhase2 = isSender ? match.senderPhase2 : match.receiverPhase2
    const theirPhase2 = isSender ? match.receiverPhase2 : match.senderPhase2

    if (phase === 1) {
      if (myPhase1 !== null) {
        return NextResponse.json({ error: 'Phase 1 decision already recorded' }, { status: 409 })
      }
    } else {
      if (match.senderPhase1 !== 'APPROVED' || match.receiverPhase1 !== 'APPROVED') {
        return NextResponse.json({ error: 'Phase 2 requires mutual Phase 1 approval' }, { status: 409 })
      }
      if (myPhase2 !== null) {
        return NextResponse.json({ error: 'Phase 2 decision already recorded' }, { status: 409 })
      }
    }

    const phaseField =
      phase === 1
        ? (isSender ? 'senderPhase1' : 'receiverPhase1')
        : (isSender ? 'senderPhase2' : 'receiverPhase2')

    console.log('[mobile-alignment-consent] Step 4: recording decision —', phaseField, '=', decision)

    if (decision === 'DECLINED') {
      await prisma.match.update({
        where: { id: match.id },
        data: { [phaseField]: 'DECLINED', status: 'DECLINED' },
      })
      console.log('[mobile-alignment-consent] Step 4: declined — match closed')
      return NextResponse.json({ success: true, outcome: 'declined' })
    }

    const theirDecisionForPhase = phase === 1
      ? (isSender ? match.receiverPhase1 : match.senderPhase1)
      : theirPhase2
    const isMutual = theirDecisionForPhase === 'APPROVED'

    if (phase === 2 && isMutual) {
      console.log('[mobile-alignment-consent] Step 4: phase 2 mutual — creating match + conversation')
      await prisma.$transaction(async (tx) => {
        await tx.match.update({
          where: { id: match.id },
          data: {
            [phaseField]: 'APPROVED',
            status: 'MATCHED',
            matchedAt: new Date(),
          },
        })
        await tx.conversation.create({
          data: {
            matchId: match.id,
            participants: {
              create: [
                { userId: match.senderId },
                { userId: match.receiverId },
              ],
            },
          },
        })
      })
      console.log('[mobile-alignment-consent] Step 4: matched and conversation created')
      return NextResponse.json({ success: true, outcome: 'matched' })
    }

    await prisma.match.update({
      where: { id: match.id },
      data: { [phaseField]: 'APPROVED' },
    })
    const outcome = isMutual ? 'phase1_mutual' : 'awaiting'
    console.log('[mobile-alignment-consent] Step 4: approved — outcome =', outcome)
    return NextResponse.json({ success: true, outcome })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    console.error('[mobile-alignment-consent] CAUGHT ERROR:', message)
    console.error('[mobile-alignment-consent] stack:', stack)
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 })
  }
}
