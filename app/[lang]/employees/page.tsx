import React from 'react'

import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries';
// import { FaWhatsapp } from "react-icons/fa";
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image';
import logo from '@/app/assets/images/178884748_padded_logo.png';


import { AppStoreLink } from '../components/shared/AppStoreLink';
import { PlayStoreLink } from '../components/shared/PlayStoreLink';


import { 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight, 
  SimpleStaggerContainer, 
  SimpleStaggerItem, 
  SimpleFadeIn 
} from '../components/shared/animations/AnimationUtils';

const features = [
    {
        name: 'Snelle toegang tot opdrachten',
        description:
          'Vind in een oogwenk opdrachten die aansluiten bij jouw vaardigheden en interesses, zonder eindeloos te hoeven zoeken.',
      },
      {
        name: 'Flexibele planning',
        description:
        'Beheer jouw eigen agenda en werk wanneer het jou uitkomt, waardoor je jouw werk en privéleven beter in balans kunt brengen.',
      },
      {
        name: 'Diverse opdrachtgevers',
        description:
          'Krijg toegang tot een breed scala aan opdrachtgevers, van startups tot grote bedrijven, en vergroot zo jouw netwerk en ervaring.',
      },
      {
        name: 'Gemakkelijke communicatie',
        description:
          'Communiceer direct met ons via de app of WhatsApp, waardoor je snel vragen kunt stellen, feedback kunt geven en opdrachten kunt afronden.',
      },
      {
        name: 'Snelle betalingen',
        description:
          'Ontvang gegarandeerde betalingen voor jouw werk zonder gedoe of vertragingen.',
      },
      {
        name: 'Waardering en feedback',
        description:
          'Bouw een sterke reputatie op door positieve beoordelingen en feedback te verzamelen van tevreden opdrachtgevers, waardoor je jouw kansen op toekomstige opdrachten vergroot.',
      },
  ]

  const stats = [
      { label: 'verschillende opdrachtgevers', value: `Oplopend \n 100+`},
      { label: 'verschillende diensten', value: 'Wekelijks 2000' },
    { label: 'kun je ook kiezen voor wekelijkse betalingen', value: 'Vanaf Februari' },
  ];

  const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
]

  const supportedLocales: Locale[] = [
    'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
    'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
  ];

const page = async ({ params }: { params: { lang: string } }) => {
   
    const lang = supportedLocales.includes(params.lang as Locale) ? (params.lang as Locale): 'en';
    const { pages } = await getDictionary(lang);
    
  return (
    <>
    <div className="mx-auto  pt-40 mt-20 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">


    <div className="bg-white">
      <div className="relative isolate">
        {/* <svg
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-gray-200"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" width="100%" height="100%" strokeWidth={0} />
        </svg> */}
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
          <FadeInLeft className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <div className="flex">
               <div className="relative flex items-center gap-x-4 rounded-full bg-white px-4 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                <span className="font-semibold text-orange-600">{pages.employeesPage.PhoneHero.CVtekst}</span>
                <span aria-hidden="true" className="h-4 w-px bg-gray-900/10" />
                <a href="#" className="flex items-center gap-x-1">
                  <span aria-hidden="true" className="absolute inset-0" />
                  {pages.employeesPage.PhoneHero.sendMessage}
                 <ChevronRightIcon aria-hidden="true" className="-mr-2 size-5 text-gray-400" /> 
                  {/* <FaWhatsapp className="h-5 w-5 text-green-600" /> */}
                </a>
              </div> 
            </div>
            <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl">
             {pages.employeesPage.PhoneHero.HeadTekst}
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              {pages.employeesPage.PhoneHero.SubTekst}
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <AppStoreLink />
              {/* <PlayStoreLink /> */}
            </div>
          </FadeInLeft>
          <FadeInRight className="mt-16 sm:mt-24 lg:mt-0 lg:shrink-0 lg:grow">
            <svg role="img" viewBox="0 0 366 729" className="mx-auto w-91.5 max-w-full drop-shadow-xl">
              <title>App screenshot</title>
              <defs>
                <clipPath id="2ade4387-9c63-4fc4-b754-10e687a0d332">
                  <rect rx={36} width={316} height={684} />
                </clipPath>
              </defs>
              <path
                d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z"
                fill="#4B5563"
              />
              <path
                d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z"
                fill="#343E4E"
              />
              <foreignObject
                width={316}
                height={684}
                clipPath="url(#2ade4387-9c63-4fc4-b754-10e687a0d332)"
                transform="translate(24 24)"
              >
                <Image
                  src={logo}
                  alt="Food delivery service" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '36px' }}
                />
              </foreignObject>
            </svg>
          </FadeInRight>
        </div>
      </div>
    </div>


    <FadeInUp className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{pages.employeesPage.headText}</h2>
        <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
            <FadeInLeft className="lg:w-full lg:max-w-2xl lg:flex-auto">
                <p className="text-xl leading-8 text-gray-600">
                {pages.employeesPage.Benefits[0].elaboration}
                </p>
                <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
                    <p>
                    {pages.employeesPage.Benefits[1].elaboration}
                    </p>
                    <p className="mt-10">
                    {pages.employeesPage.Benefits[2].elaboration}
                    </p>
                </div>
            </FadeInLeft>
            <FadeInRight className="lg:flex lg:flex-auto lg:justify-center">
                <dl className="w-64 space-y-8 xl:w-80">
                    {pages.employeesPage.Benefits.map((stat) => (
                        <div key={stat.benefit} className="flex flex-col-reverse gap-y-4">
                            <dt className="text-base leading-7 text-gray-600">{stat.benefit}</dt>
                            <dd className="text-5xl font-semibold tracking-tight text-gray-900">{stat.subText}</dd>
                        </div>
                    ))}
                </dl>
            </FadeInRight>
        </div>
    </FadeInUp>
</div>

<SimpleFadeIn className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
        <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
            alt=""
            className="aspect-[5/2] w-full object-cover xl:rounded-3xl" />
    </SimpleFadeIn><div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInUp className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{pages.employeesPage.Features.headText}</h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                {pages.employeesPage.Features.subText}
                </p>
            </FadeInUp>
            <SimpleStaggerContainer className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {pages.employeesPage.Features.features.map((feature) => (
                    <SimpleStaggerItem key={feature.feature}>
                        <dt className="font-semibold text-gray-900">{feature.feature}</dt>
                        <dd className="mt-1 text-gray-600">{feature.elaboration}</dd>
                    </SimpleStaggerItem>
                ))}
            </SimpleStaggerContainer>
        </div>
    </div>
    </>
  )
}

export default page