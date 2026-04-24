import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit-memory'

const schema = z.object({
  supabaseUserId: z.string().uuid(),
})

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'mobile-profile-status').limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    console.log('[mobile-profile-status] Step 1: params')
    const { supabaseUserId } = schema.parse({
      supabaseUserId: req.nextUrl.searchParams.get('supabaseUserId'),
    })
    console.log('[mobile-profile-status] Step 1 OK: supabaseUserId =', supabaseUserId)

    console.log('[mobile-profile-status] Step 2: looking up profile')
    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId },
      select: {
        id: true,
        user: { select: { tier: true } },
      },
    })
    if (!profile) {
      console.log('[mobile-profile-status] Step 2: profile not found')
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    console.log('[mobile-profile-status] Step 2 OK: profileId =', profile.id, ', tier =', profile.user.tier)

    console.log('[mobile-profile-status] Step 3: counting photos')
    const photoCount = await prisma.photo.count({ where: { profileId: profile.id } })
    console.log('[mobile-profile-status] Step 3 OK: photoCount =', photoCount)

    const tier = profile.user.tier
    const photoLimit = tier === 'FREE' ? 1 : 6

    return NextResponse.json({
      hasPhoto: photoCount > 0,
      photoCount,
      photoLimit,
      tier,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid supabaseUserId' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    console.error('[mobile-profile-status] CAUGHT ERROR:', message)
    console.error('[mobile-profile-status] stack:', stack)
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 })
  }
}
