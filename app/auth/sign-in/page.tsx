
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AuthCard from '@/components/AuthCard'

export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email_confirmed_at) {
        // User is authenticated and email is confirmed
        router.push('/dashboard')
      } else if (user && !user.email_confirmed_at) {
        // User exists but email not confirmed
        setUser(user)
      } else {
        // No user, show sign in form
        setUser(null)
      }
      setLoading(false)
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        router.push('/dashboard')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase.auth])

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-guinea-green mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading...</p>
      </div>
    )
  }

  if (user && !user.email_confirmed_at) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AuthCard title="Email Confirmation Required">
          <p className="text-sm text-gray-600 mb-4">
            Please check your email and click the confirmation link before signing in.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="btn bg-gray-600 text-white w-full"
          >
            Sign Out
          </button>
        </AuthCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthCard title="Sign In">
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              required
              type="email"
              name="email"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              required
              type="password"
              name="password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <button className="btn bg-guinea-green text-white w-full">
            Sign In
          </button>
          <div className="text-center text-sm">
            <a href="/auth/forgot-password" className="text-guinea-green hover:underline">
              Forgot password?
            </a>
          </div>
        </form>
      </AuthCard>
    </div>
  )
}
