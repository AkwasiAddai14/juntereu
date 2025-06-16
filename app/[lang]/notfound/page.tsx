"use client";


import { Locale } from '@/i18n.config'
import { getDictionary } from '@/app/[lang]/dictionaries'
import Link from 'next/link';
import Image from 'next/image'; 
import logo from '@/app/assets/images/178884748_padded_logo.png'; 
import foodDelivery from '@/app/assets/images/iStock-1198049220.jpg';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
  'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
];

export default async function Example({ params }: { params: { lang: string } }) {
  const lang = supportedLocales.includes(params.lang as Locale)
  ? (params.lang as Locale)
  : 'en';
  const { pages, navigation, footer } = await getDictionary(lang);
    return (
      <>
        {/*
          This example requires updating your template:
  
          ```
          <html class="h-full">
          <body class="h-full">
          ```
        */}
        <div className="grid min-h-full grid-cols-1 grid-rows-[1fr,auto,1fr] bg-white lg:grid-cols-[max(50%,36rem),1fr]">
          <header className="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8">
            <a href={`/${lang}`}>
              <span className="sr-only">Junter</span>
              <Image className="h-32 w-auto" src={logo} alt="Junter logo" /> {/* Use Image component for optimized images */}
            </a>
          </header>
          <main className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
            <div className="max-w-lg">
              <p className="text-base/8 font-semibold text-sky-600">{pages.notfoundPage.title}</p>
              <h1 className="mt-4 text-pretty text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
                {pages.notfoundPage.headText}
              </h1>
              <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                {pages.notfoundPage.subText}
              </p>
              <div className="mt-10">
                <a href={`/${lang}`} className="text-sm/7 font-semibold text-sky-600">
                  <span aria-hidden="true">&larr;</span> {pages.notfoundPage.button1}
                </a>
              </div>
            </div>
          </main>
          <footer className="self-end lg:col-span-2 lg:col-start-1 lg:row-start-3">
            <div className="border-t border-gray-100 bg-gray-50 py-10">
              <nav className="mx-auto flex w-full max-w-7xl items-center gap-x-4 px-6 text-sm/7 text-gray-600 lg:px-8">
                <a href={`/${lang}/contact`}>{pages.notfoundPage.button2}</a>
                <svg viewBox="0 0 2 2" aria-hidden="true" className="size-0.5 fill-gray-300">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <a href={`/${lang}/dashboard`}>{pages.notfoundPage.button3}</a>
              </nav>
            </div>
          </footer>
          <div className="hidden lg:relative lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:block">
          <Image
              src={foodDelivery}
              alt="foodDelivery"
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </div>
      </>
    )
  }