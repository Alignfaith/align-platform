import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { draftData: true },
    })

    return NextResponse.json({
      draftData: (profile?.draftData as Record<string, unknown>) ?? {},
    })
  } catch (error) {
    console.error('[draft/load]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
