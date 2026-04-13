const ADMIN_EMAIL = 'thomas@dstormpg.com'
const FROM = 'ALIGN <noreply@alignfaith.com>'

interface EmailPayload {
  to: string
  subject: string
  html: string
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log('[email] RESEND_API_KEY not set — would have sent:')
    console.log(`  To:      ${payload.to}`)
    console.log(`  Subject: ${payload.subject}`)
    return
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({ from: FROM, ...payload })
  } catch (err) {
    // Log but never throw — email failure should not break the request
    console.error('[email] send failed:', err)
  }
}

// ── Notification helpers ──────────────────────────────────────────

export async function notifyFounderApplication(app: {
  name: string
  email: string
  phone: string
  city: string
  state: string
  createdAt: Date
}) {
  const date = app.createdAt.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  })

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New ALIGN Founder Application – ${app.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #374151;">
        <div style="background: linear-gradient(135deg, #c0182a 0%, #7a0f1a 100%); padding: 28px 32px; border-radius: 12px 12px 0 0;">
          <h2 style="margin: 0; color: #fff; font-size: 18px;">New Founder Application</h2>
        </div>
        <div style="background: #ffffff; padding: 28px 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 7px 0; color: #9ca3af; width: 90px; font-size: 13px;">Name</td><td style="padding: 7px 0; font-weight: 600;">${app.name}</td></tr>
            <tr><td style="padding: 7px 0; color: #9ca3af; font-size: 13px;">Email</td><td style="padding: 7px 0;"><a href="mailto:${app.email}" style="color: #c0182a;">${app.email}</a></td></tr>
            <tr><td style="padding: 7px 0; color: #9ca3af; font-size: 13px;">Phone</td><td style="padding: 7px 0;">${app.phone}</td></tr>
            <tr><td style="padding: 7px 0; color: #9ca3af; font-size: 13px;">Location</td><td style="padding: 7px 0;">${app.city}, ${app.state}</td></tr>
            <tr><td style="padding: 7px 0; color: #9ca3af; font-size: 13px;">Submitted</td><td style="padding: 7px 0;">${date}</td></tr>
          </table>
          <div style="margin-top: 24px;">
            <a href="https://app.alignfaith.com/admin/founder-applications" style="background: #c0182a; color: #fff; padding: 10px 22px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 14px;">
              Review Application →
            </a>
          </div>
        </div>
      </div>
    `,
  })
}

export async function notifyAdminMessage(msg: {
  name: string | null
  email: string | null
  subject: string
  message: string
  createdAt: Date
}) {
  const senderName = msg.name || msg.email || 'Unknown'
  const date = msg.createdAt.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  })

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `New ALIGN Message from ${senderName} – ${msg.subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #374151;">
        <div style="background: #1a0408; padding: 28px 32px; border-radius: 12px 12px 0 0;">
          <h2 style="margin: 0; color: #fff; font-size: 18px;">New Member Message</h2>
        </div>
        <div style="background: #ffffff; padding: 28px 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 7px 0; color: #9ca3af; width: 90px; font-size: 13px;">From</td><td style="padding: 7px 0; font-weight: 600;">${senderName}</td></tr>
            ${msg.email ? `<tr><td style="padding: 7px 0; color: #9ca3af; font-size: 13px;">Email</td><td style="padding: 7px 0;"><a href="mailto:${msg.email}" style="color: #c0182a;">${msg.email}</a></td></tr>` : ''}
            <tr><td style="padding: 7px 0; color: #9ca3af; font-size: 13px;">Subject</td><td style="padding: 7px 0; font-weight: 600;">${msg.subject}</td></tr>
            <tr><td style="padding: 7px 0; color: #9ca3af; font-size: 13px;">Sent</td><td style="padding: 7px 0;">${date}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0 0 20px;" />
          <p style="margin: 0; font-size: 14px; line-height: 1.75; white-space: pre-wrap; color: #374151;">${msg.message}</p>
          <div style="margin-top: 24px;">
            <a href="https://app.alignfaith.com/admin/communications" style="background: #1a0408; color: #fff; padding: 10px 22px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 14px;">
              View in Admin →
            </a>
          </div>
        </div>
      </div>
    `,
  })
}
