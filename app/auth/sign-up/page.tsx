
'use client'
import { FormEvent, useState } from 'react'
import Link from 'next/link'
import AuthCard from '@/components/AuthCard'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const origin = window.location.origin
    const res = await fetch('/api/auth/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: name, siteOrigin: origin }),
    })
    setLoading(false)
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      return setMessage(j.error || 'Failed to send confirmation email')
    }
    setMessage('Check your email to confirm your account before signing in.')
  }

  return (
    <AuthCard title="Create your account">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input required value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"/>
        </div>
        <button disabled={loading} className="btn bg-guinea-green text-white w-full">{loading?'Creating...':'Sign up'}</button>
        <p className="text-sm">
          Already have an account? <Link className="text-guinea-green font-medium" href="/auth/sign-in">Sign in</Link>
        </p>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </form>
    </AuthCard>
  )
}
