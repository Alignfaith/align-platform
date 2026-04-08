import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAIL = 'thomas@dstormpg.com'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json()

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (message.trim().length < 20) {
      return NextResponse.json({ error: 'Message must be at least 20 characters' }, { status: 400 })
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        message: message.trim(),
      },
    })

    // Send email notification via Resend if configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'Align Faith <noreply@alignfaith.com>',
          to: ADMIN_EMAIL,
          replyTo: email.trim(),
          subject: `New Matching Inquiry from ${name.trim()}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #B91C1C;">New Matching Service Inquiry</h2>
              <table style="width:100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #6b7280; width: 80px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name.trim()}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email.trim()}">${email.trim()}</a></td></tr>
                ${phone?.trim() ? `<tr><td style="padding: 8px 0; color: #6b7280;">Phone</td><td style="padding: 8px 0;">${phone.trim()}</td></tr>` : ''}
              </table>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
              <h3 style="color: #374151; margin-bottom: 8px;">Message</h3>
              <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${message.trim()}</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
              <p style="color: #9ca3af; font-size: 12px;">
                View all inquiries: <a href="https://app.alignfaith.com/admin/inquiries">admin/inquiries</a><br/>
                Inquiry ID: ${inquiry.id}
              </p>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('[inquiries] email send failed:', emailErr)
        // Don't fail the request if email fails — inquiry is already saved
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/inquiries]', error)
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
