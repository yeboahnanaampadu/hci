'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const { language, setLanguage } = useLanguage()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container-prose flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Guinea E-Visa" width={32} height={32} />
          <div className="leading-tight">
            <div className="font-semibold">Guinea E-Visa</div>
            <div className="text-xs text-gray-600 -mt-0.5">Republic of Guinea</div>
          </div>
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
           {user ? (
             <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">{language === 'en' ? 'Welcome' : 'Bienvenue'}, {user.user_metadata?.full_name || user.email}</Link>
           ) : (
             <Link href="/auth/sign-in" className="text-gray-700 hover:text-gray-900">{language === 'en' ? 'Sign In' : 'Se Connecter'}</Link>
           )}
           <Link href={user ? "/dashboard" : "/"} className="text-gray-700 hover:text-gray-900">{language === 'en' ? 'Home' : 'Accueil'}</Link>
           <Link href="/retrieve-pay" className="text-gray-700 hover:text-gray-900">{language === 'en' ? 'Retrieve & Pay' : 'Récupérer & Payer'}</Link>
           <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-gray-700 hover:text-gray-900 flex items-center gap-1">
              {language === 'en' ? 'English' : 'Français'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button onClick={() => { setLanguage('en'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">English</button>
                <button onClick={() => { setLanguage('fr'); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Français</button>
              </div>
            )}
          </div>
        </nav>
        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu" className="md:hidden text-gray-700 hover:text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container-prose py-4 space-y-4">
            {user ? (
              <Link href="/dashboard" className="block text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>{language === 'en' ? 'Welcome' : 'Bienvenue'}, {user.user_metadata?.full_name || user.email}</Link>
            ) : (
              <Link href="/auth/sign-in" className="block text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>{language === 'en' ? 'Sign In' : 'Se Connecter'}</Link>
            )}
            <Link href={user ? "/dashboard" : "/"} className="block text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>{language === 'en' ? 'Home' : 'Accueil'}</Link>
            <Link href="/retrieve-pay" className="block text-gray-700 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>{language === 'en' ? 'Retrieve & Pay' : 'Récupérer & Payer'}</Link>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setLanguage('en'); setDropdownOpen(false); setMobileMenuOpen(false); }} className="btn border w-full xs:w-auto">English</button>
              <button onClick={() => { setLanguage('fr'); setDropdownOpen(false); setMobileMenuOpen(false); }} className="btn border w-full xs:w-auto">Français</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
