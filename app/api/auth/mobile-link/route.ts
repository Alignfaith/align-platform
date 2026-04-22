import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyPassword, emailSchema } from '@/lib/security'
import { checkRateLimit } from '@/lib/rate-limit-memory'

const schema = z.object({
  email: emailSchema,
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (checkRateLimit(ip, 'mobile-link').limited) {
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

  if (!user) {
    return NextResponse.json({ error: 'No account found for this email' }, { status: 404 })
  }

  if (!user.passwordHash) {
    // OAuth-only account — no password to verify against
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const isValid = await verifyPassword(data.password, user.passwordHash)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  if (!user.profile) {
    return NextResponse.json({ error: 'No profile found for this account' }, { status: 404 })
  }

  return NextResponse.json({
    userId: user.id,
    profileId: user.profile.id,
    firstName: user.profile.firstName,
    email: user.email,
  })
}
