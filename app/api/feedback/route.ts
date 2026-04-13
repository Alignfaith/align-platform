import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyAdminMessage } from '@/lib/email'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, subject, message, category } = body

        // Validate required fields
        if (!subject || !message) {
            return NextResponse.json(
                { error: 'Subject and message are required' },
                { status: 400 }
            )
        }

        // Create feedback entry
        const feedback = await prisma.feedback.create({
            data: {
                name: name || null,
                email: email || null,
                subject,
                message,
                category: category || 'general',
            },
        })

        notifyAdminMessage({
            name: feedback.name,
            email: feedback.email,
            subject: feedback.subject,
            message: feedback.message,
            createdAt: feedback.createdAt,
        })

        return NextResponse.json({ success: true, id: feedback.id })
    } catch (error) {
        console.error('Feedback submission error:', error)
        return NextResponse.json(
            { error: 'Failed to submit feedback' },
            { status: 500 }
        )
    }
}

// GET - Retrieve feedback (for admin)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const unreadOnly = searchParams.get('unread') === 'true'

        const feedback = await prisma.feedback.findMany({
            where: unreadOnly ? { isRead: false } : undefined,
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ feedback })
    } catch (error) {
        console.error('Feedback fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch feedback' },
            { status: 500 }
        )
    }
}
