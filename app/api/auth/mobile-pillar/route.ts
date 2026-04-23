import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { Pillar } from '@prisma/client'
import { checkRateLimit } from '@/lib/rate-limit-memory'

const schema = z.object({
  supabaseUserId: z.string().uuid(),
  pillar: z.enum(['SPIRITUAL', 'MENTAL', 'INTIMACY', 'FINANCIAL', 'PHYSICAL', 'APPEARANCE']),
})

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'mobile-pillar').limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    console.log('[mobile-pillar] Step 1: params')
    const params = req.nextUrl.searchParams
    const { supabaseUserId, pillar } = schema.parse({
      supabaseUserId: params.get('supabaseUserId'),
      pillar: params.get('pillar'),
    })
    console.log('[mobile-pillar] Step 1 OK: supabaseUserId =', supabaseUserId, ', pillar =', pillar)

    console.log('[mobile-pillar] Step 2: looking up profile')
    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId },
      select: { id: true },
    })
    if (!profile) {
      console.log('[mobile-pillar] Step 2: profile not found')
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    console.log('[mobile-pillar] Step 2 OK: profileId =', profile.id)

    console.log('[mobile-pillar] Step 3: fetching data')
    const [pillarScore, responses] = await Promise.all([
      prisma.pillarScore.findUnique({
        where: { profileId_pillar: { profileId: profile.id, pillar: pillar as Pillar } },
        select: { selfScore: true },
      }),
      prisma.pillarResponse.findMany({
        where: { profileId: profile.id, pillar: pillar as Pillar },
        select: { questionId: true, value: true },
        orderBy: { questionId: 'asc' },
      }),
    ])
    console.log(
      '[mobile-pillar] Step 3 OK: selfScore =',
      pillarScore?.selfScore ?? null,
      ', responses count =',
      responses.length
    )

    return NextResponse.json({
      pillar,
      selfScore: pillarScore?.selfScore ?? null,
      responses,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      const first = error.issues[0]
      const field = first.path[0]
      if (field === 'supabaseUserId') {
        return NextResponse.json({ error: 'Invalid supabaseUserId' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Invalid pillar' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    console.error('[mobile-pillar] CAUGHT ERROR:', message)
    console.error('[mobile-pillar] stack:', stack)
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 })
  }
}
