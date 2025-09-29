'use client'
import { useState } from 'react'
import Link from 'next/link'
import AuthCard from '@/components/AuthCard'
import { useLanguage } from '@/lib/LanguageContext'
import { createClient } from '@/lib/supabase/client'

export default function RetrievePayPage() {
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle')
  const [application, setApplication] = useState<any>(null)

  const t = {
    en: {
      title: 'Retrieve Application & Pay',
      desc: 'Already submitted an application? Enter the email address you used — we\'ll instantly check your application status and show any pending payment details.',
      email: 'Enter your email',
      check: 'Check Status',
      checking: 'Checking...',
      notFound: 'No application found with this email address.',
      found: 'Application Found',
      type: 'Type',
      status: 'Status',
      amount: 'Amount Due',
      pay: 'Proceed to Payment'
    },
    fr: {
      title: 'Récupérer Demande & Payer',
      desc: 'Déjà soumis une demande ? Entrez l\'adresse e-mail que vous avez utilisée — nous vérifierons instantanément le statut de votre demande et afficherons les détails de paiement en attente.',
      email: 'Entrez votre e-mail',
      check: 'Vérifier le Statut',
      checking: 'Vérification...',
      notFound: 'Aucune demande trouvée avec cette adresse e-mail.',
      found: 'Demande Trouvée',
      type: 'Type',
      status: 'Statut',
      amount: 'Montant Dû',
      pay: 'Procéder au Paiement'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const supabase = createClient()
    const { data, error } = await supabase.rpc('get_application_by_email', { p_email: email })
    if (error || !data) {
      setStatus('not_found')
    } else {
      setApplication({
        id: data.id,
        type: data.visa_type,
        status: data.status.charAt(0).toUpperCase() + data.status.slice(1).replace('_', ' '),
        amount: data.amount_usd
      })
      setStatus('found')
    }
  }

  return (
    <AuthCard title={t[language].title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600">
          {t[language].desc}
        </p>
        <div>
          <label className="block text-sm font-medium">{t[language].email}</label>
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
        <button disabled={status === 'loading'} className="btn bg-guinea-green text-white w-full">
          {status === 'loading' ? t[language].checking : t[language].check}
        </button>
      </form>

      {status === 'not_found' && (
        <p className="mt-4 text-sm text-red-600">{t[language].notFound}</p>
      )}

      {status === 'found' && application && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold">{t[language].found}</h3>
          <p><strong>{t[language].type}:</strong> {application.type}</p>
          <p><strong>{t[language].status}:</strong> {application.status}</p>
          <p><strong>{t[language].amount}:</strong> {application.amount}</p>
          <Link href={`/payment?id=${application.id}`} className="mt-2 btn bg-blue-600 text-white inline-block">{t[language].pay}</Link>
        </div>
      )}
    </AuthCard>
  )
}