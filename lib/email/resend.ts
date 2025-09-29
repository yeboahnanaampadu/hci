import { Resend } from 'resend'

export function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('Missing RESEND_API_KEY')
  return new Resend(key)
}

export function getDefaultFromEmail() {
  // Build a friendly From header like: "Guinea E‑Visa <onboarding@resend.dev>"
  const email = process.env.EMAIL_FROM || 'onboarding@resend.dev'
  const name = process.env.EMAIL_FROM_NAME || 'Guinea E‑Visa'
  return `${name} <${email}>`
}


