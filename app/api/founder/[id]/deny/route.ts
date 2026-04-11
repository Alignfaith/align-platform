import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const application = await prisma.founderApplication.findUnique({ where: { id } })
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    await prisma.founderApplication.update({
      where: { id },
      data: { status: 'DENIED' },
    })

    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        await resend.emails.send({
          from: 'ALIGN <noreply@alignfaith.com>',
          to: application.email,
          subject: 'Your ALIGN Founding Member Application',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #374151;">
              <div style="background: #1a0408; padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: -0.02em;">ALIGN</h1>
              </div>
              <div style="background: #ffffff; padding: 36px 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; line-height: 1.7; margin-top: 0;">Hi ${application.name},</p>
                <p style="font-size: 16px; line-height: 1.7;">
                  Thank you for your interest in becoming a Founding Member of ALIGN. We genuinely appreciate you taking the time to apply.
                </p>
                <p style="font-size: 16px; line-height: 1.7;">
                  After careful review, we are not able to move forward with your application at this time. Founding member spots are extremely limited and we received many strong applications.
                </p>
                <p style="font-size: 16px; line-height: 1.7;">
                  This is not a final door — ALIGN will be opening more broadly in the near future, and we hope you will be part of the community when we do. In the meantime, we encourage you to begin your preparation journey with the book that inspired this platform.
                </p>
                <div style="background: #fff7f7; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.7;">
                    <strong>Relationship Fitness</strong> by Thomas Marks — the Six Pillars framework that ALIGN is built on.<br/>
                    <a href="https://a.co/d/09qpJCAh" style="color: #c0182a; font-weight: 600;">Get it on Amazon →</a>
                  </p>
                </div>
                <p style="font-size: 14px; color: #6b7280; line-height: 1.7; margin-bottom: 0;">
                  Grow before you go.<br/>
                  <strong style="color: #374151;">— The ALIGN Team</strong>
                </p>
              </div>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('[founder/deny] email failed:', emailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[founder/deny]', error)
    return NextResponse.json({ error: 'Failed to deny application' }, { status: 500 })
  }
}
