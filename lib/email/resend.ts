import { Resend } from 'resend'

export function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('Missing RESEND_API_KEY')
  return new Resend(key)
}

export function getDefaultFromEmail() {
  // Use Resend's verified domain
  const email = process.env.EMAIL_FROM || 'onboarding@resend.dev'
  return email
}


