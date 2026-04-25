import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const schema = z.object({
  key: z.string().min(1).max(64),
  data: z.unknown(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { key, data } = schema.parse(await req.json())

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, draftData: true },
    })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const current = (profile.draftData as Record<string, unknown> | null) ?? {}
    const updated =
      data === null || data === undefined
        ? Object.fromEntries(Object.entries(current).filter(([k]) => k !== key))
        : { ...current, [key]: data }

    await prisma.profile.update({
      where: { id: profile.id },
      data: { draftData: updated as Prisma.InputJsonValue },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'key is required' }, { status: 400 })
    }
    console.error('[draft/save]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
