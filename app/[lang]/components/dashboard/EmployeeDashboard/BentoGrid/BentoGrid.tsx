'use client'

import React, { useEffect, useState } from 'react';
import Financien from "@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/Wrappers/FinancienWrapper";
import Profiel from "@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/Wrappers/ProfileWrapper";
import Checkout from "@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/Wrappers/CheckoutWrapper";
import Events from "@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/Wrappers/UpComingEventsWrapper";
import Dashboard from "@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/Shifts/DashboardWrapper";
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

type Props = {
  lang: Locale;
};

export default function BentoGrid ({ lang }: Props) {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      if (lang) {
        const dict = await getDictionary(lang);
        setDashboard(dict);
      }
    };
    fetchDictionary();
  }, [lang]);

  if (!dashboard) {
    return <div>Loading...</div>;
  }
  
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-base/7 font-semibold text-sky-600">{dashboard.werknemersPage.BentoGrid.headTitle}</h2>
          <p className="mt-2 max-w-lg text-pretty text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
          {dashboard.werknemersPage.BentoGrid.subTitle}
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
            <div className="relative lg:col-span-3">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
                <Dashboard lang={lang}/>
                <div className="p-10 pt-4">
                  <h3 className="text-sm/4 font-semibold text-sky-600">{dashboard.werknemersPage.BentoGrid.gridTitles[0]}</h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950"></p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                    
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
            </div>
            <div className="relative lg:col-span-3">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-tr-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
                <Profiel lang={lang}/>
                <div className="p-10 pt-4">
                  <h3 className="text-sm/4 font-semibold text-sky-600">{dashboard.werknemersPage.BentoGrid.gridTitles[1]}</h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950"></p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                    
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-tr-[2rem]" />
            </div>
            <div className="relative lg:col-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-bl-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
                <Events lang={lang}/>
                <div className="p-10 pt-4">
                  <h3 className="text-sm/4 font-semibold text-sky-600">{dashboard.werknemersPage.BentoGrid.gridTitles[2]}</h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950"></p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                    
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-bl-[2rem]" />
            </div>
            <div className="relative lg:col-span-2">
              <div className="absolute inset-px rounded-lg bg-white" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                <Checkout lang={lang}/>
                <div className="p-10 pt-4">
                  <h3 className="text-sm/4 font-semibold text-sky-600">{dashboard.werknemersPage.BentoGrid.gridTitles[3]}</h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950"></p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                    
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5" />
            </div>
            <div className="relative lg:col-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
                <Financien lang={lang}/>
                <div className="p-10 pt-4">
                  <h3 className="text-sm/4 font-semibold text-sky-600">{dashboard.werknemersPage.BentoGrid.gridTitles[4]}</h3>
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950"></p>
                  <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                    
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  