
'use client'
import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function StatusPage() {
  const supabase = createClient()
  const [ref, setRef] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null); setResult(null)
    const { data, error } = await supabase
      .from('applications')
      .select('reference_number,status,visa_type,created_at,travel_start')
      .eq('reference_number', ref.trim().toUpperCase())
      .maybeSingle()
    if (error) setError(error.message)
    else if (!data) setError('Not found. Check your reference number.')
    else setResult(data)
  }

  return (
    <main className="container-prose my-10">
      <div className="mx-auto max-w-xl card">
        <h1 className="text-xl font-semibold">Check Application Status</h1>
        <form onSubmit={onSubmit} className="mt-4 flex gap-3">
          <input value={ref} onChange={e=>setRef(e.target.value)} placeholder="Enter Reference Number (e.g., GN‑EVISA‑2025‑0001)" className="flex-1 rounded-lg border border-gray-300 px-3 py-2"/>
          <button className="btn bg-guinea-green text-white">Check</button>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {result && (
          <div className="mt-5 text-sm">
            <p><span className="font-medium">Reference:</span> {result.reference_number}</p>
            <p><span className="font-medium">Status:</span> {result.status}</p>
            <p><span className="font-medium">Visa Type:</span> {result.visa_type}</p>
            <p><span className="font-medium">Submitted:</span> {new Date(result.created_at).toLocaleString()}</p>
          </div>
        )}
      </div>
    </main>
  )
}
