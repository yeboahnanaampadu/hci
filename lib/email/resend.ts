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

export function getOwnerEmail() {
  // For testing mode, send all emails to the owner's verified email
  return process.env.OWNER_EMAIL || 'yeboahnanaampadu@gmail.com'
}


