
'use client'
import { useState, FormEvent } from 'react'
import AuthCard from '@/components/AuthCard'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const origin = window.location.origin
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/update-password` })
    if (error) setMessage(error.message)
    else setMessage('Check your email for a password reset link.')
  }

  return (
    <AuthCard title="Reset your password">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"/>
        </div>
        <button className="btn bg-guinea-green text-white w-full">Send reset link</button>
        {message && <p className="text-sm">{message}</p>}
      </form>
    </AuthCard>
  )
}
