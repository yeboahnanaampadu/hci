
'use client'
import { FormEvent, useState } from 'react'
import Link from 'next/link'
import AuthCard from '@/components/AuthCard'
import { createClient } from '@/lib/supabase/client'

export default function SignInPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setMessage(error.message)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <AuthCard title="Sign in">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"/>
        </div>
        <button disabled={loading} className="btn bg-guinea-green text-white w-full">{loading?'Signing in...':'Sign in'}</button>
        <div className="text-sm flex items-center justify-between">
          <Link className="text-guinea-green font-medium" href="/auth/forgot-password">Forgot password?</Link>
          <Link className="text-gray-700" href="/auth/sign-up">Create an account</Link>
        </div>
        {message && <p className="text-sm text-red-600">{message}</p>}
      </form>
    </AuthCard>
  )
}
