
'use client'
import { useState, FormEvent } from 'react'
import AuthCard from '@/components/AuthCard'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return
    setSending(true)
    setMessage(null)
    try {
      const origin = window.location.origin
      const res = await fetch('/api/auth/send-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, siteOrigin: origin }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setMessage(j.error || 'Failed to send reset email')
      } else {
        setMessage('Check your email for a password reset link.')
      }
    } finally {
      setTimeout(() => setSending(false), 1200)
    }
  }

  return (
    <AuthCard title="Reset your password">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"/>
        </div>
        <button disabled={sending} className="btn bg-guinea-green text-white w-full">{sending ? 'Sending...' : 'Send reset link'}</button>
        {message && <p className="text-sm">{message}</p>}
      </form>
    </AuthCard>
  )
}
