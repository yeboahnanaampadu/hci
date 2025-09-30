
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()

  useEffect(() => {
    // Automatically redirect to dashboard
    router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-guinea-green mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
