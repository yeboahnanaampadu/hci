
'use client'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

export default function DashboardPage() {
  const { language } = useLanguage()
  const [applications, setApplications] = useState<any[]>([])
  const [canceling, setCanceling] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('applications')
      .select('id, reference_number, status, visa_type, created_at, travel_start, applicants(email)')
      .neq('status', 'rejected')
      .order('created_at', { ascending: false })
      .limit(10)
    console.log('Loading applications, data:', data, 'error:', error)
    setApplications(data ?? [])
  }

  const cancelApplication = async (id: string) => {
    if (!cancelReason.trim()) return alert('Please provide a reason.')
    const supabase = createClient()
    console.log('Cancelling application id:', id)
    const { data, error } = await supabase
      .from('applications')
      .update({ status: 'rejected' })
      .eq('id', id)
    console.log('Update result - data:', data, 'error:', error)
    if (error) alert('Error canceling application: ' + error.message)
    else {
      // Insert into status history
      await supabase
        .from('application_status_history')
        .insert({ application_id: id, status: 'rejected', note: cancelReason })
      console.log('Application cancelled successfully, reloading applications')
      setCanceling(null)
      setCancelReason('')
      await loadApplications()
      console.log('Applications reloaded after cancel')
    }
  }

  const t = {
    en: {
      welcome: 'Welcome',
      signOut: 'Sign out',
      recentApps: 'Your recent applications',
      newApp: 'New Application',
      type: 'Type',
      submitted: 'Submitted',
      helpSupport: 'Help & Support',
      docReq: 'Document requirements',
      procTimes: 'Processing times',
      contact: 'Contact support',
      noApps: 'You have no applications yet.',
      cancel: 'Cancel',
      cancelReason: 'Reason for cancellation',
      cancelApp: 'Cancel Application'
    },
    fr: {
      welcome: 'Bienvenue',
      signOut: 'Se déconnecter',
      recentApps: 'Vos demandes récentes',
      newApp: 'Nouvelle Demande',
      type: 'Type',
      submitted: 'Soumis',
      helpSupport: 'Aide & Support',
      docReq: 'Exigences documentaires',
      procTimes: 'Délais de traitement',
      contact: 'Contacter le support',
      noApps: 'Vous n\'avez pas encore de demandes.',
      cancel: 'Annuler',
      cancelReason: 'Raison de l\'annulation',
      cancelApp: 'Annuler la Demande'
    }
  }

  return (
    <main className="container-prose my-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold">{language === 'en' ? 'Welcome to Guinea E-Visa' : 'Bienvenue sur Guinea E-Visa'}</h1>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="card md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="font-semibold">{t[language].recentApps}</h2>
            <Link href="/dashboard/start" className="btn bg-guinea-green text-white w-full sm:w-auto">{t[language].newApp}</Link>
          </div>
          <div className="mt-4 divide-y">
            {applications.length === 0 && <p className="text-sm text-gray-600">{t[language].noApps}</p>}
            {applications.map((a:any) => (
              <div key={a.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">{a.reference_number}</p>
                  <p className="text-gray-600 break-words">{t[language].type}: {a.visa_type} • {t[language].submitted} {new Date(a.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs ${a.status === 'payment_pending' ? 'bg-yellow-100 text-yellow-800' : a.status === 'submitted' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
                    {a.status === 'payment_pending' ? 'Pending Payment' : a.status === 'submitted' ? 'Submitted' : a.status.charAt(0).toUpperCase() + a.status.slice(1).replace('_', ' ')}
                  </span>
                  {a.status === 'payment_pending' ? (
                    <Link href={`/payment?id=${a.id}`} className="btn bg-green-600 text-white text-xs w-full sm:w-auto text-center">Pay Now</Link>
                  ) : (
                    <button onClick={() => setCanceling(a.id)} className="text-red-600 text-xs">{t[language].cancel}</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold">{t[language].helpSupport}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="text-guinea-green hover:underline" href="/document-requirements">{t[language].docReq}</Link></li>
            <li><Link className="text-guinea-green hover:underline" href="/processing-times">{t[language].procTimes}</Link></li>
            <li><Link className="text-guinea-green hover:underline" href="/contact-support">{t[language].contact}</Link></li>
          </ul>
        </div>
      </div>

      {canceling && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold">{t[language].cancelApp}</h3>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder={t[language].cancelReason}
              className="mt-3 w-full border border-gray-300 rounded p-2"
              rows={3}
            />
            <div className="mt-4 flex gap-2">
              <button onClick={() => cancelApplication(canceling)} className="btn bg-red-600 text-white">{t[language].cancel}</button>
              <button onClick={() => { setCanceling(null); setCancelReason(''); }} className="btn border">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
