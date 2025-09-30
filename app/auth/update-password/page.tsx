
'use client'
import { Suspense, useEffect, useState, FormEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AuthCard from '@/components/AuthCard'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

function UpdatePasswordContent() {
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>('')
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type')

    if (accessToken && refreshToken && type === 'recovery') {
      // Set the session using the tokens from the password reset email
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(({ error }) => {
        if (error) {
          console.error('Session error:', error)
          setMessage(`Session error: ${error.message}`)
        } else {
          setMessage('Session established. You can now set a new password.')
        }
      })
    } else if (params.get('code')) {
      // Handle PKCE flow if needed
      const code = params.get('code')
      if (code) {
        supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
          if (error) {
            console.error('Code exchange error:', error)
            setMessage(`Code exchange error: ${error.message}`)
          }
        })
      }
    }
  }, [params, supabase.auth])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return setMessage('Passwords do not match.')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setMessage(error.message)
    else {
      setMessage('Password updated. You can now sign in with your new password.')
      setTimeout(()=>router.replace('/auth/sign-in'), 1500)
    }
  }

  return (
    <AuthCard title="Set a new password">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">New password</label>
          <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Confirm new password</label>
          <input required type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"/>
        </div>
        <button className="btn bg-guinea-green text-white w-full">Update password</button>
        {message && <p className="text-sm">{message}</p>}
      </form>
    </AuthCard>
  )
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<AuthCard title="Set a new password"><p className="text-sm">Loading...</p></AuthCard>}>
      <UpdatePasswordContent />
    </Suspense>
  )
}
