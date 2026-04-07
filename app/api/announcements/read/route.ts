import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { ids } = await req.json() as { ids: string[] }
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ success: true })
  }

  await Promise.all(
    ids.map((announcementId) =>
      prisma.announcementRead.upsert({
        where: { userId_announcementId: { userId: session.user.id, announcementId } },
        update: {},
        create: { userId: session.user.id, announcementId },
      })
    )
  )

  return NextResponse.json({ success: true })
}
