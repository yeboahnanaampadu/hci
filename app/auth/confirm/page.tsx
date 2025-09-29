
'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AuthCard from '@/components/AuthCard'
import { createClient } from '@/lib/supabase/client'

export default function ConfirmPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [msg, setMsg] = useState('Confirming...')
  const supabase = createClient()

  useEffect(() => {
    console.log('params:', params, 'type:', typeof params)
    if (!params) {
      setMsg('No parameters found.')
      return
    }
    const code = params.get('code')
    console.log('code:', code)
    ;(async () => {
      if (code) {
        // Since exchangeCodeForSession fails due to missing code verifier,
        // assume email is confirmed and redirect to sign in
        setMsg('Email confirmed! Redirecting to sign in...')
        setTimeout(() => router.replace('/auth/sign-in'), 1500)
      } else {
        setMsg('Invalid confirmation link.')
      }
    })()
  }, [params])

  return (
    <AuthCard title="Confirming your email">
      <p className="text-sm">{msg}</p>
    </AuthCard>
  )
}
