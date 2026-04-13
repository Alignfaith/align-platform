import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'FOUNDER-'
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params

  try {
    const application = await prisma.founderApplication.findUnique({ where: { id } })
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Generate a unique invite code
    let inviteCode = generateInviteCode()
    let attempts = 0
    while (attempts < 10) {
      const existing = await prisma.founderApplication.findFirst({ where: { inviteCode } })
      if (!existing) break
      inviteCode = generateInviteCode()
      attempts++
    }

    await prisma.founderApplication.update({
      where: { id },
      data: { status: 'APPROVED', inviteCode },
    })

    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        // Email to applicant
        await resend.emails.send({
          from: 'ALIGN <noreply@alignfaith.com>',
          to: application.email,
          subject: 'Welcome to ALIGN — You\'re a Founding Member',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #374151;">
              <div style="background: linear-gradient(135deg, #c0182a 0%, #7a0f1a 100%); padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -0.02em;">Welcome, Founding Member</h1>
              </div>
              <div style="background: #ffffff; padding: 36px 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <p style="font-size: 16px; line-height: 1.7; margin-top: 0;">Hi ${application.name},</p>
                <p style="font-size: 16px; line-height: 1.7;">
                  Your application to join ALIGN as a Founding Member has been approved. We are honored to have you as one of the first members of this community.
                </p>

                <div style="background: #fff7f7; border: 1px solid #fecaca; border-radius: 8px; padding: 20px 24px; margin: 24px 0; text-align: center;">
                  <p style="margin: 0 0 6px; font-size: 12px; color: #9ca3af; letter-spacing: 0.1em; text-transform: uppercase;">Your Invite Code</p>
                  <p style="margin: 0; font-size: 24px; font-weight: 700; color: #c0182a; letter-spacing: 0.08em; font-family: monospace;">${inviteCode}</p>
                </div>

                <p style="font-size: 16px; line-height: 1.7;">Here is what to expect next:</p>
                <ul style="font-size: 15px; line-height: 1.9; padding-left: 20px; color: #374151;">
                  <li><strong>3 months of free access</strong> — your membership will begin the moment you log in, at no charge for your first three months.</li>
                  <li><strong>A copy of <em>Relationship Fitness</em></strong> — we will be mailing your complimentary copy to you shortly. Watch for a follow-up message about your mailing address.</li>
                  <li><strong>Founding Member status</strong> — your profile will carry permanent recognition as a founding member of ALIGN.</li>
                </ul>
                <div style="margin: 32px 0; text-align: center;">
                  <a href="https://app.alignfaith.com/register" style="background: #c0182a; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px;">
                    Create Your Account →
                  </a>
                </div>
                <p style="font-size: 14px; color: #6b7280; line-height: 1.7;">
                  Grow before you go.<br/>
                  <strong style="color: #374151;">— The ALIGN Team</strong>
                </p>
              </div>
            </div>
          `,
        })

        // Internal notification to arrange book shipment
        if (process.env.FOUNDER_EMAIL) {
          await resend.emails.send({
            from: 'ALIGN <noreply@alignfaith.com>',
            to: process.env.FOUNDER_EMAIL,
            subject: `Founding Member Approved — ${application.name}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #374151;">
                <h2 style="color: #c0182a;">Founding Member Approved</h2>
                <p>A new founding member has been approved. Please arrange to send them a copy of <em>Relationship Fitness</em>.</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                  <tr><td style="padding: 8px 0; color: #6b7280; width: 100px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${application.name}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Phone</td><td style="padding: 8px 0;">${application.phone}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;"><a href="mailto:${application.email}">${application.email}</a></td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Location</td><td style="padding: 8px 0;">${application.city}, ${application.state}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Invite Code</td><td style="padding: 8px 0; font-family: monospace; font-weight: 700; color: #c0182a;">${inviteCode}</td></tr>
                </table>
                <p style="margin-top: 24px; font-size: 13px; color: #9ca3af;">
                  View all applications: <a href="https://app.alignfaith.com/admin/founder-applications">admin/founder-applications</a>
                </p>
              </div>
            `,
          })
        }
      } catch (emailErr) {
        console.error('[founder/approve] email failed:', emailErr)
      }
    }

    return NextResponse.json({ success: true, inviteCode })
  } catch (error) {
    console.error('[founder/approve]', error)
    return NextResponse.json({ error: 'Failed to approve application' }, { status: 500 })
  }
}
