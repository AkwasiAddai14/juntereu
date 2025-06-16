"use client";

import { CheckIcon } from '@heroicons/react/20/solid';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
  'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
];

const tiers = [
  {
    name: 'Freelancers',
    id: 'tier-hobby',
    href: '../sign-up',
    priceMonthly: '€16,50',
    description: '€14 + €2,50 (fee)',
    features: ['Minder administratieve lasten', 'Geen werkgeverslasten', 'Projectmatige inzet met een specifieke oplevering'],
  },
  {
    name: 'Uitzendkrachten',
    id: 'tier-team',
    href: '../sign-up',
    priceMonthly: '€19,20',
    description: '€12 x 1.6 (omrekenfactor)',
    features: [
        'Minder administratieve lasten',
      'Directe inzetbaarheid',
      'Geschikt voor structurele samenwerking',
      'Potentie voor continuïteit.',
    
    ],
  },
]

export default async function Example({ params }: { params: { lang: string } }) {
  const lang = supportedLocales.includes(params.lang as Locale)
  ? (params.lang as Locale)
  : 'en';
  const { pages, navigation, footer } = await getDictionary(lang);
  return (
    <div className="isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-96 pt-32 text-center sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-base/7 font-semibold text-sky-400">{pages.pricingPage.title}</h2>
          <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
            {pages.pricingPage.headText}
          </p>
        </div>
        <div className="relative mt-6">
          <p className="mx-auto max-w-2xl text-pretty text-lg font-medium text-gray-700 sm:text-xl/8">
         {pages.pricingPage.subText}
          </p>
          <svg
            viewBox="0 0 1208 1024"
            className="absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
          >
            <ellipse cx={604} cy={512} rx={604} ry={512} fill="url(#6d1bd035-0dd1-437e-93fa-59d316231eb0)" />
            <defs>
              <radialGradient id="6d1bd035-0dd1-437e-93fa-59d316231eb0" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700" /> {/* Goudgeel */}
              <stop offset="70%" stopColor="#FFA500" /> {/* Oranje */}
              <stop offset="100%" stopColor="#ED912F" /> {/* Donkerder Oranje */}
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flow-root bg-white pb-24 sm:pb-32">
        <div className="-mt-80">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
              {pages.pricingPage.pricingCards.map((tier) => (
                <div
                  key={tier.naam}
                  className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10"
                >
                  <div>
                    <h3 id={tier.naam} className="text-base/7 font-semibold text-sky-600">
                      {tier.naam}
                    </h3>
                    <div className="mt-4 flex items-baseline gap-x-2">
                      <span className="text-5xl font-semibold tracking-tight text-gray-900">{tier.prijs}</span>
                      <span className="text-base/7 font-semibold text-gray-600"> </span>
                    </div>
                    <p className="mt-6 text-base/7 text-gray-600">{tier.prijsUitleg}</p>
                    <ul role="list" className="mt-10 space-y-4 text-sm/6 text-gray-600">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-sky-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={`../${lang}/sign-up`}
                    aria-describedby={tier.naam}
                    className="mt-8 block rounded-md bg-sky-600 px-3.5 py-2 text-center text-sm/6 font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                  >
                    {tier.button }
                  </a>
                </div>
              ))}
              <div className="flex flex-col items-start gap-x-8 gap-y-6 rounded-3xl p-8 ring-1 ring-gray-900/10 sm:gap-y-10 sm:p-10 lg:col-span-2 lg:flex-row lg:items-center">
                <div className="lg:min-w-0 lg:flex-1">
                  <h3 className="text-base/7 font-semibold text-sky-600">{pages.pricingPage.HeadTextCTA}</h3>
                  <p className="mt-1 text-base/7 text-gray-600">
                  {pages.pricingPage.SubTextCTA}
                  </p>
                </div>
                <a
                  href={`../${lang}/contact`}
                  className="rounded-md px-3.5 py-2 text-sm/6 font-semibold text-sky-600 ring-1 ring-inset ring-sky-200 hover:ring-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  {pages.pricingPage.ButtonCTA} <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
