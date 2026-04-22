import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyPassword, emailSchema } from '@/lib/security'
import { checkRateLimit } from '@/lib/rate-limit-memory'

const schema = z.object({
  email: emailSchema,
  password: z.string().min(1),
  supabaseUserId: z.string().uuid(),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'mobile-link-confirm').limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let data: z.infer<typeof schema>
  try {
    data = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { profile: true },
  })

  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const isValid = await verifyPassword(data.password, user.passwordHash)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  if (!user.profile) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const profile = user.profile

  if (profile.supabaseUserId && profile.supabaseUserId !== data.supabaseUserId) {
    return NextResponse.json(
      { error: 'This account is already linked to a different device' },
      { status: 409 }
    )
  }

  const updated = await prisma.profile.update({
    where: { id: profile.id },
    data: { supabaseUserId: data.supabaseUserId },
    select: { id: true, firstName: true },
  })

  return NextResponse.json({
    success: true,
    profileId: updated.id,
    firstName: updated.firstName,
  })
}
