import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getDefaultFromEmail, getResend } from '@/lib/email/resend'

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name, siteOrigin } = await req.json()
    if (!email || !password || !siteOrigin) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1) Create the user (email not confirmed)
    const supabaseAdmin = getSupabaseAdmin()
    const { data: userCreate, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: full_name ? { full_name } : undefined,
    })
    if (createErr) return NextResponse.json({ error: createErr.message }, { status: 400 })

    const userId = userCreate.user.id

    // 2) Generate a magic link for email confirmation
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        redirectTo: `${siteOrigin}/auth/confirm`,
      },
    })
    if (linkErr) return NextResponse.json({ error: linkErr.message }, { status: 400 })

    const confirmUrl = linkData.properties.action_link

    // 3) Send email via Resend
    const from = getDefaultFromEmail()
    const resend = getResend()
    let attempt = 0
    let lastError: any = null
    while (attempt < 3) {
      const sendResult = await resend.emails.send({
        from,
        to: email,
        subject: 'Guinea E‑Visa – Confirm your email',
        html: `
          <p>Hello${full_name ? ` ${full_name}` : ''},</p>
          <p>Please confirm your email to activate your Guinea E‑Visa account.</p>
          <p><a href="${confirmUrl}">${confirmUrl}</a></p>
          <p>If you did not request this, you can safely ignore this message.</p>
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb" />
          <p style="color:#6b7280;font-size:12px;">Republic of Guinea – E‑Visa Service</p>
        `,
      })
      if (!(sendResult as any).error) {
        return NextResponse.json({ ok: true, userId, id: (sendResult as any).data?.id })
      }
      const err = (sendResult as any).error
      lastError = err
      console.error('Resend send error:', err)
      if (attempt === 0) {
        const fallback = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: 'Guinea E‑Visa – Confirm your email',
          html: `
            <p>Hello${full_name ? ` ${full_name}` : ''},</p>
            <p>Please confirm your email to activate your Guinea E‑Visa account.</p>
            <p><a href="${confirmUrl}">${confirmUrl}</a></p>
            <p>If you did not request this, you can safely ignore this message.</p>
            <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb" />
            <p style="color:#6b7280;font-size:12px;">Republic of Guinea – E‑Visa Service</p>
          `,
        })
        if (!(fallback as any).error) {
          return NextResponse.json({ ok: true, userId, id: (fallback as any).data?.id, fallbackSender: true })
        }
      }
      if (err?.statusCode === 429 || err?.name === 'rate_limit_exceeded') {
        await new Promise(r => setTimeout(r, 600 * (attempt + 1)))
        attempt++
        continue
      }
      break
    }
    if (lastError?.statusCode === 429 || lastError?.name === 'rate_limit_exceeded') {
      return NextResponse.json({ error: 'Rate limited by email provider. Please try again shortly.' }, { status: 429 })
    }
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 })
  }
}


