'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { Shield, BriefcaseBusiness, Plane } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const { language } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const t = {
    en: {
      heroTitle: 'Welcome to Guinea E-Visa Portal',
      heroDesc: 'Apply for your Guinea visa online quickly and securely. Get your visa approved in 3–5 business days.',
      applyNow: 'Apply Now',
      checkStatus: 'Check Status',
      visaTypes: 'Visa Types Available',
      tourist: 'Tourist Visa',
      touristDesc: 'Perfect for leisure travel, sightseeing, and visiting friends or family in Guinea.',
      valid30: 'Valid for 30 days',
      single: 'Single entry',
      usd85: '$85 USD',
      viewReq: 'View Requirements',
      business: 'Business Visa',
      businessDesc: 'For business meetings, conferences, and commercial activities in Guinea.',
      valid90: 'Valid for 90 days',
      multiple: 'Multiple entry',
      usd150: '$150 USD',
      transit: 'Transit Visa',
      transitDesc: 'For travelers passing through Guinea to reach their final destination.',
      valid7: 'Valid for 7 days',
      usd45: '$45 USD',
      howItWorks: 'How It Works',
      chooseType: 'Choose Visa Type',
      chooseDesc: 'Select the appropriate visa category for your travel purpose',
      fillApp: 'Fill Application',
      fillDesc: 'Complete the online form with your personal and travel details',
      makePay: 'Make Payment',
      payDesc: 'Pay securely online using credit card or bank transfer',
      receiveVisa: 'Receive Visa',
      receiveDesc: 'Get your approved e-visa via email within 3–5 business days',
      readyApply: 'Ready to Apply?',
      startApp: 'Start Application'
    },
    fr: {
      heroTitle: 'Bienvenue sur le Portail E-Visa de Guinée',
      heroDesc: 'Demandez votre visa pour la Guinée en ligne rapidement et en toute sécurité. Obtenez votre visa approuvé en 3-5 jours ouvrables.',
      applyNow: 'Appliquer Maintenant',
      checkStatus: 'Vérifier le Statut',
      visaTypes: 'Types de Visa Disponibles',
      tourist: 'Visa Touristique',
      touristDesc: 'Parfait pour les voyages de loisirs, le tourisme et les visites à des amis ou à la famille en Guinée.',
      valid30: 'Valable 30 jours',
      single: 'Entrée unique',
      usd85: '85 USD',
      viewReq: 'Voir les Exigences',
      business: 'Visa d\'Affaires',
      businessDesc: 'Pour les réunions d\'affaires, conférences et activités commerciales en Guinée.',
      valid90: 'Valable 90 jours',
      multiple: 'Entrées multiples',
      usd150: '150 USD',
      transit: 'Visa de Transit',
      transitDesc: 'Pour les voyageurs passant par la Guinée pour atteindre leur destination finale.',
      valid7: 'Valable 7 jours',
      usd45: '45 USD',
      howItWorks: 'Comment Ça Marche',
      chooseType: 'Choisir le Type de Visa',
      chooseDesc: 'Sélectionnez la catégorie de visa appropriée pour votre objectif de voyage',
      fillApp: 'Remplir la Demande',
      fillDesc: 'Complétez le formulaire en ligne avec vos données personnelles et de voyage',
      makePay: 'Effectuer le Paiement',
      payDesc: 'Payez en toute sécurité en ligne par carte de crédit ou virement bancaire',
      receiveVisa: 'Recevoir le Visa',
      receiveDesc: 'Recevez votre e-visa approuvé par e-mail dans les 3-5 jours ouvrables',
      readyApply: 'Prêt à Appliquer?',
      startApp: 'Commencer l\'Application'
    }
  }
  return (
    <main>
      {/* HERO */}
      <section className="hero-wrap text-white">
        <div className="container-prose py-20 sm:py-24">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center">
            {t[language].heroTitle}
          </h1>
          <p className="mt-4 text-center text-white/90 max-w-3xl mx-auto">
            {t[language].heroDesc}
            <br className="hidden sm:block" />
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href={user ? "/dashboard" : "/auth/sign-up"} className="btn btn-hero-primary">{t[language].applyNow}</Link>
            <Link href="/retrieve-pay" className="btn btn-hero-outline">{t[language].checkStatus}</Link>
          </div>
        </div>
      </section>

      {/* VISA TYPES */}
      <section id="types" className="container-prose py-12">
        <h2 className="text-2xl font-bold text-center text-green-800">{t[language].visaTypes}</h2>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tourist */}
          <div className="card card-accent-yellow">
            <div className="flex items-center gap-3">
              <div className="icon-circle">
                <Shield className="w-5 h-5 text-black" strokeWidth={2.75} />
              </div>
              <h3 className="font-semibold">{t[language].tourist}</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              {t[language].touristDesc}
            </p>
            <ul className="mt-4 space-y-2">
              <li className="bullet">{t[language].valid30}</li>
              <li className="bullet">{t[language].single}</li>
              <li className="bullet">{t[language].usd85}</li>
            </ul>
            <Link href="#" className="mt-4 inline-block text-amber-600 font-medium">{t[language].viewReq}</Link>
          </div>

          {/* Business */}
          <div className="card card-accent-red">
            <div className="flex items-center gap-3">
              <div className="icon-circle">
                <BriefcaseBusiness className="w-5 h-5 text-black" strokeWidth={2.75} />
              </div>
              <h3 className="font-semibold">{t[language].business}</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              {t[language].businessDesc}
            </p>
            <ul className="mt-4 space-y-2">
              <li className="bullet">{t[language].valid90}</li>
              <li className="bullet">{t[language].multiple}</li>
              <li className="bullet">{t[language].usd150}</li>
            </ul>
            <Link href="#" className="mt-4 inline-block text-amber-600 font-medium">{t[language].viewReq}</Link>
          </div>

          {/* Transit */}
          <div className="card card-accent-green">
            <div className="flex items-center gap-3">
              <div className="icon-circle">
                <Plane className="w-5 h-5 text-black" strokeWidth={2.75} />
              </div>
              <h3 className="font-semibold">{t[language].transit}</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              {t[language].transitDesc}
            </p>
            <ul className="mt-4 space-y-2">
              <li className="bullet">{t[language].valid7}</li>
              <li className="bullet">{t[language].single}</li>
              <li className="bullet">{t[language].usd45}</li>
            </ul>
            <Link href="#" className="mt-4 inline-block text-amber-600 font-medium">{t[language].viewReq}</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="container-prose">
        <h2 className="text-2xl font-bold text-center text-green-800">{t[language].howItWorks}</h2>
        <div className="grid sm:grid-cols-4 gap-8 mt-8">
          {[
            {n:1,t:t[language].chooseType,d:t[language].chooseDesc},
            {n:2,t:t[language].fillApp,d:t[language].fillDesc},
            {n:3,t:t[language].makePay,d:t[language].payDesc},
            {n:4,t:t[language].receiveVisa,d:t[language].receiveDesc},
          ].map(s => (
            <div key={s.n} className="text-center">
              <div className="size-16 rounded-full bg-yellow-200 grid place-items-center text-lg font-bold">{s.n}</div>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-gray-600 max-w-[16rem] mx-auto">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 mb-6">
        <div className="container-prose">
          <div className="rounded-2xl cta-wrap text-center py-10 px-6 shadow-sm">
            <h3 className="text-xl font-bold text-black">{t[language].readyApply}</h3>
            <p className="mt-2 text-sm text-black/80">
              {t[language].startApp}
              <br className="hidden sm:block"/> West Africa
            </p>
            <Link href={user ? "/dashboard" : "/auth/sign-up"} className="btn mt-5 bg-[#2D5A27] text-white hover:brightness-110">
              {t[language].startApp}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
