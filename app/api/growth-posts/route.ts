import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { pillar, content } = body

    if (!pillar || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // TEMP: replace later with real auth user
    const profileId = 'demo-profile-id'

const post = await prisma.growthPost.create({
  data: {
    profileId,
    pillar,
    content,
  },
})

    return NextResponse.json(post)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to create growth post' },
      { status: 500 }
    )
  }
}
