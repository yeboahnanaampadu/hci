import { Resend } from 'resend'

export function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('Missing RESEND_API_KEY')
  return new Resend(key)
}

export function getDefaultFromEmail() {
  // Build a friendly From header like: "Guinea E‑Visa <no-reply@guinea-evisa.gov.gn>"
  const email = process.env.EMAIL_FROM || 'no-reply@guinea-evisa.gov.gn'
  const name = process.env.EMAIL_FROM_NAME || 'Guinea E‑Visa'
  return `${name} <${email}>`
}


