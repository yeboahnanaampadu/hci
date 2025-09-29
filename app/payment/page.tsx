'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import AuthCard from '@/components/AuthCard'
import { useLanguage } from '@/lib/LanguageContext'
import { createClient } from '@/lib/supabase/client'

export default function PaymentPage() {
  const { language } = useLanguage()
  const params = useSearchParams()
  const supabase = createClient()
  const [application, setApplication] = useState<any>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = params.get('id')
    if (id) {
      supabase.from('applications').select('id, visa_type, amount_usd').eq('id', id).single().then(({ data, error }) => {
        if (error) setError('Application not found')
        else setApplication(data)
      })
    } else {
      setError('No application ID provided')
    }
  }, [params])

  const t = {
    en: {
      title: 'Complete Payment',
      amount: `Amount: $${application?.amount_usd || 0} USD`,
      cardNumber: 'Card Number',
      expiry: 'Expiry Date (MM/YY)',
      cvv: 'CVV',
      pay: 'Pay Now',
      processing: 'Processing...'
    },
    fr: {
      title: 'Compléter le Paiement',
      amount: `Montant: ${application?.amount_usd || 0} USD`,
      cardNumber: 'Numéro de Carte',
      expiry: 'Date d\'Expiration (MM/AA)',
      cvv: 'CVV',
      pay: 'Payer Maintenant',
      processing: 'Traitement...'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!application) return
    setProcessing(true)
    // Mock payment
    setTimeout(async () => {
      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'submitted' })
        .eq('id', application.id)
      if (updateError) {
        setError('Payment successful but status update failed')
      } else {
        // Add status history
        await supabase
          .from('application_status_history')
          .insert({ application_id: application.id, status: 'submitted', note: 'Payment received, application submitted for review' })
        // Redirect to dashboard
        window.location.href = '/dashboard'
      }
      setProcessing(false)
    }, 2000)
  }

  if (error) return <AuthCard title="Error"><p className="text-red-600">{error}</p></AuthCard>
  if (!application) return <AuthCard title={t[language].title}><p>Loading...</p></AuthCard>

  return (
    <AuthCard title={t[language].title}>
      <p className="text-sm text-gray-600 mb-4">{t[language].amount}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">{t[language].cardNumber}</label>
          <input
            required
            type="text"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="1234 5678 9012 3456"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">{t[language].expiry}</label>
            <input
              required
              type="text"
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="12/25"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">{t[language].cvv}</label>
            <input
              required
              type="text"
              value={cvv}
              onChange={e => setCvv(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="123"
            />
          </div>
        </div>
        <button disabled={processing} className="btn bg-green-600 text-white w-full">
          {processing ? t[language].processing : t[language].pay}
        </button>
      </form>
    </AuthCard>
  )
}