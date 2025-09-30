
'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AuthCard from '@/components/AuthCard'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

function ConfirmContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [msg, setMsg] = useState('Confirming...')
  const supabase = createClient()

  useEffect(() => {
    if (!params) {
      setMsg('No parameters found.')
      return
    }

    const code = params.get('code')
    const error = params.get('error')
    const errorDescription = params.get('error_description')

    ;(async () => {
      if (error) {
        setMsg(`Confirmation error: ${errorDescription || error}`)
        return
      }

      if (code) {
        try {
          // Handle the email confirmation
          const { data, error: confirmError } = await supabase.auth.verifyOtp({
            token_hash: code,
            type: 'email'
          })

          if (confirmError) {
            console.error('Confirmation error:', confirmError)
            setMsg(`Confirmation failed: ${confirmError.message}`)
          } else {
            setMsg('Email confirmed! Redirecting to sign in...')
            setTimeout(() => router.replace('/auth/sign-in'), 1500)
          }
        } catch (err) {
          console.error('Unexpected confirmation error:', err)
          setMsg('Confirmation failed. Please try signing in.')
          setTimeout(() => router.replace('/auth/sign-in'), 1500)
        }
      } else {
        setMsg('Invalid confirmation link.')
      }
    })()
  }, [params, supabase.auth])

  return (
    <AuthCard title="Confirming your email">
      <p className="text-sm">{msg}</p>
    </AuthCard>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<AuthCard title="Confirming your email"><p className="text-sm">Loading...</p></AuthCard>}>
      <ConfirmContent />
    </Suspense>
  )
}
