
'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createWorker } from 'tesseract.js'
import * as mrz from 'mrz'

export default function StartApplicationPage() {
  const supabase = createClient()
  const router = useRouter()
  const [form, setForm] = useState({ visa_type: 'tourist', given_names: '', surname: '', passport_number: '', travel_start: '', travel_end: '' })
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const processOCR = async (file: File) => {
    try {
      const image = new Image()
      image.src = URL.createObjectURL(file)
      await new Promise((resolve) => { image.onload = resolve })

      const worker = await createWorker('eng')
      const { data: { text } } = await worker.recognize(image)
      await worker.terminate()

      // Parse MRZ
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
      const mrzLines = lines.filter(line => line.length >= 44 && (line.startsWith('P<') || /^\d/.test(line)))
      if (mrzLines.length >= 2) {
        const parsed = mrz.parse([mrzLines[0], mrzLines[1]])
        if (parsed.valid) {
          setForm(prev => ({
            ...prev,
            given_names: (parsed.fields as any).givenNames || prev.given_names,
            surname: (parsed.fields as any).surname || prev.surname,
            passport_number: (parsed.fields as any).documentNumber || prev.passport_number
          }))
        }
      }
    } catch (err) {
      // Silent fail
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!selectedFile) return setError('Please upload your ID card image.')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return setError('Not signed in.')
    console.log('Submitting application with form data:', form)
    const params = {
      p_visa_type: form.visa_type,
      p_given_names: form.given_names,
      p_surname: form.surname,
      p_passport_number: form.passport_number,
      p_email: user.email,
      p_travel_start: form.travel_start,
      p_travel_end: form.travel_end
    }
    console.log('RPC params:', params)
    const { error, data } = await supabase.rpc('create_application', params)
    if (error) {
      console.error('RPC error:', error)
      setError(error.message)
      return
    }
    // The function returns void, but we can get the reference number from the inserted application
    // For now, redirect to dashboard
    router.replace('/dashboard')
  }

  return (
    <main className="container-prose my-10">
      <div className="mx-auto max-w-2xl card">
        <h1 className="text-xl font-semibold">Start a new application</h1>
        <form onSubmit={onSubmit} className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Visa type</label>
            <select value={form.visa_type} onChange={e=>setForm({...form, visa_type: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">
              <option value="tourist">Tourist</option>
              <option value="business">Business</option>
              <option value="transit">Transit</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Upload Passport/ID Image for OCR</label>
            <input type="file" accept="image/*" onChange={e => { if (e.target.files) { setSelectedFile(e.target.files[0]); processOCR(e.target.files[0]); } }} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Given names</label>
            <input value={form.given_names} onChange={e=>setForm({...form, given_names: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" required/>
          </div>
          <div>
            <label className="block text-sm font-medium">Surname</label>
            <input value={form.surname} onChange={e=>setForm({...form, surname: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" required/>
          </div>
          <div>
            <label className="block text-sm font-medium">Passport number</label>
            <input value={form.passport_number} onChange={e=>setForm({...form, passport_number: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" required/>
          </div>
          <div>
            <label className="block text-sm font-medium">Travel start</label>
            <input type="date" value={form.travel_start} onChange={e=>setForm({...form, travel_start: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" required/>
          </div>
          <div>
            <label className="block text-sm font-medium">Travel end</label>
            <input type="date" value={form.travel_end} onChange={e=>setForm({...form, travel_end: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" required/>
          </div>
          <div className="sm:col-span-2">
            <button className="btn bg-guinea-green text-white w-full">Submit application</button>
          </div>
        </form>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </main>
  )
}
