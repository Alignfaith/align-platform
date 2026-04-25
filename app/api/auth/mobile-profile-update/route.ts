import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit-memory'

const schema = z.object({
  supabaseUserId: z.string().uuid(),
  firstName: z.string().min(1, 'First name is required.').max(50),
  lastName: z.string().min(1, 'Last name is required.').max(50),
  city: z.string().min(1, 'City is required.').max(100),
  state: z.string().min(1, 'State is required.').max(100),
  bio: z.string().max(1000, 'Bio must be under 1000 characters.').optional().nullable(),
  seekingGender: z.enum(['MALE', 'FEMALE']),
  relationshipGoal: z.enum(['MARRIAGE', 'SERIOUS_DATING', 'DISCERNING']),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'mobile-profile-update').limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    console.log('[mobile-profile-update] Step 1: parsing body')
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const {
      supabaseUserId,
      firstName,
      lastName,
      city,
      state,
      bio,
      seekingGender,
      relationshipGoal,
    } = schema.parse(body)
    console.log('[mobile-profile-update] Step 1 OK: supabaseUserId =', supabaseUserId)

    console.log('[mobile-profile-update] Step 2: looking up profile')
    const profile = await prisma.profile.findUnique({
      where: { supabaseUserId },
      select: { id: true },
    })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    console.log('[mobile-profile-update] Step 2 OK: profileId =', profile.id)

    console.log('[mobile-profile-update] Step 3: updating profile')
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        city: city.trim(),
        state: state.trim(),
        bio: bio?.trim() || null,
        seekingGender,
        relationshipGoal,
      },
    })
    console.log('[mobile-profile-update] Step 3 OK')

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? 'Invalid request' }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    console.error('[mobile-profile-update] CAUGHT ERROR:', message)
    console.error('[mobile-profile-update] stack:', stack)
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 })
  }
}
