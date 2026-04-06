import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tier = session.user.tier
    if (tier !== 'TIER_1' && tier !== 'TIER_2') {
        return NextResponse.json({ error: 'Upgrade required' }, { status: 403 })
    }

    try {
        const filePath = path.join(process.cwd(), 'private', 'books', 'relationship-fitness.pdf')
        const fileBuffer = await readFile(filePath)

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="relationship-fitness.pdf"',
                // Prevent caching so the auth check runs each request
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                // Discourage browser-level download prompts
                'X-Content-Type-Options': 'nosniff',
            },
        })
    } catch {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }
}
