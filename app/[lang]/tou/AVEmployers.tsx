import React from 'react';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

import { getDictionary } from '@/app/[lang]/dictionaries';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

const AVbedrijven = async ({ params }: { params: { lang: string } }) => {
  const lang = supportedLocales.includes(params.lang as Locale)
  ? (params.lang as Locale)
  : 'en';
  const { pages } = await getDictionary(lang);


  return (
    <div className="bg-white px-6 py-32 lg:px-8">
        <div className="mx-auto items-center justify-center max-w-3xl text-base leading-7 text-gray-700">
          <p className="text-base font-semibold leading-7 text-sky-600">{pages.termsofusePage.AVbedrijven.header}{/* Algemene voorwaarden */}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{pages.termsofusePage.AVbedrijven.title}{/* Voor bedrijven */}</h1>
         {/*  <div
          className="relative left-1/2 -z-50 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0EA5E9] to-[#dbeafe] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{clipPath:'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}
          /> */}
          {pages.termsofusePage.AVbedrijven.hoofdstukken.map((hoofdstuk, index) => (
            <section key={index} className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {hoofdstuk.titel}
          </h2>

          {/* Paragrafen zonder subsecties */}
          {hoofdstuk.inhoud && Array.isArray(hoofdstuk.inhoud) &&
            hoofdstuk.inhoud.map((paragraaf: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, i: React.Key | null | undefined) => (
              <p key={i} className="mt-2 text-lg">{paragraaf}</p>
            ))
          }

          {/* Subsecties */}
          {hoofdstuk.subsecties && hoofdstuk.subsecties.map((sub, j) => (
            <div key={j} className="mt-6">
              <p className="font-semibold text-lg">{sub.subtitel}</p>
              <p className="mt-2 text-base">{sub.inhoud}</p>
            </div>
          ))}
        </section>
      ))}

      {/* Contactgegevens */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{pages.termsofusePage.AVbedrijven.contact.titel}</h2>
        <p className="mt-2">{pages.termsofusePage.AVbedrijven.contact.inhoud}</p>
        <a className="block mt-2 font-semibold text-sky-600" href={`mailto:${pages.termsofusePage.AVbedrijven.contact.email1}`}>
          {pages.termsofusePage.AVbedrijven.contact.email1}
        </a>
        <a className="block mt-2 font-semibold text-sky-600" href={`mailto:${pages.termsofusePage.AVbedrijven.contact.email2}`}>
          {pages.termsofusePage.AVbedrijven.contact.email2}
        </a>
      </section>
          </div>
        </div>
  )
}

export default AVbedrijven