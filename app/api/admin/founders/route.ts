import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status && status !== 'ALL'
      ? { status: status as 'PENDING' | 'APPROVED' | 'DENIED' }
      : {}

    const [applications, pendingCount] = await Promise.all([
      prisma.founderApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.founderApplication.count({ where: { status: 'PENDING' } }),
    ])

    return NextResponse.json({ applications, pendingCount })
  } catch (error) {
    console.error('[GET /api/admin/founders]', error)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}
