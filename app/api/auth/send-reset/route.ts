import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getDefaultFromEmail, getResend } from '@/lib/email/resend'

export async function POST(req: NextRequest) {
  try {
    const { email, siteOrigin } = await req.json()
    if (!email || !siteOrigin) {
      console.error('send-reset: missing fields', { hasEmail: !!email, hasSiteOrigin: !!siteOrigin })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate password recovery link regardless of user existence to avoid leaking accounts
    const supabaseAdmin = getSupabaseAdmin()
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: `${siteOrigin}/auth/update-password` },
    })
    if (linkErr) {
      console.error('send-reset: generateLink error', linkErr)
      return NextResponse.json({ error: linkErr.message }, { status: 400 })
    }

    const resetUrl = linkData.properties.action_link

    const resend = getResend()
    let attempt = 0
    let lastError: any = null
    while (attempt < 3) {
      const sendResult = await resend.emails.send({
        from: getDefaultFromEmail(),
        to: email,
        subject: 'Guinea E‑Visa – Reset your password',
        html: `
          <p>You requested a password reset for your Guinea E‑Visa account.</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>If you did not request this, you can ignore this email.</p>
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb" />
          <p style="color:#6b7280;font-size:12px;">Republic of Guinea – E‑Visa Service</p>
        `,
      })
      if (!(sendResult as any).error) {
        return NextResponse.json({ ok: true, id: (sendResult as any).data?.id })
      }
      const err = (sendResult as any).error
      lastError = err
      console.error('Resend send error:', err)
      // If domain is not verified, retry once via Resend's verified onboarding sender
      if (attempt === 0 && (err?.statusCode === 403 || err?.name === 'validation_error')) {
        const fallback = await resend.emails.send({
          from: 'Guinea E‑Visa <onboarding@resend.dev>',
          to: email,
          subject: 'Guinea E‑Visa – Reset your password',
          html: `
            <p>You requested a password reset for your Guinea E‑Visa account.</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>If you did not request this, you can ignore this email.</p>
            <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb" />
            <p style="color:#6b7280;font-size:12px;">Republic of Guinea – E‑Visa Service</p>
          `,
        })
        if (!(fallback as any).error) {
          return NextResponse.json({ ok: true, id: (fallback as any).data?.id, fallbackSender: true })
        }
      }
      if (err?.statusCode === 429 || err?.name === 'rate_limit_exceeded') {
        // Exponential backoff: 600ms, 1200ms
        await new Promise(r => setTimeout(r, 600 * (attempt + 1)))
        attempt++
        continue
      }
      break
    }
    if (lastError?.statusCode === 429 || lastError?.name === 'rate_limit_exceeded') {
      return NextResponse.json({ error: 'Rate limited by email provider. Please try again in a moment.' }, { status: 429 })
    }
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 })
  }
}


