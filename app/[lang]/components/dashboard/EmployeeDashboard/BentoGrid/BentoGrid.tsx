'use client'

import React, { useEffect, useState } from 'react';
import Financien from "@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/Financien";
import Profiel from "@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/Profile";
import Checkout from "@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/Checkout";
import Events from "@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/UpcomingEvents";
import Dashboard from "@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/Shifts/Dashboard";
import { AISummaryCard } from "@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/AISummaryCard";
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

type Props = {
  lang: Locale;
  dashboard: any;
};

export default function BentoGrid ({ lang, dashboard }: Props) {
  if (!dashboard) {
    return <div>Loading...</div>;
  }
  
    return (
      <div className="h-full w-full bg-white">
        <div className="h-full w-full py-6">
          <div className="mb-6 px-6">
            <h2 className="text-base/7 font-semibold text-sky-600">{dashboard.werknemersPage.BentoGrid.headTitle}</h2>
            <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
            {dashboard.werknemersPage.BentoGrid.subTitle}
            </p>
          </div>
          <div className="mx-auto max-w-8xl px-6">
            <div className="h-[calc(100vh-200px)] grid grid-cols-1 gap-3 lg:grid-cols-6 lg:grid-rows-2">
            <div className="relative lg:col-span-3 h-full">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
                <div className="flex-1 overflow-y-auto">
                  <Dashboard lang={lang} dictionary={dashboard}/>
                </div>
                <AISummaryCard 
                  section="shifts" 
                  userData={{}} 
                  title={dashboard.werknemersPage.BentoGrid.gridTitles[0]}
                />
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
            </div>
            <div className="relative lg:col-span-3 h-full">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-tr-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
                <div className="flex-1 overflow-y-auto">
                  <Profiel dashboard={dashboard}/>
                </div>
                <AISummaryCard 
                  section="work" 
                  userData={{}} 
                  title={dashboard.werknemersPage.BentoGrid.gridTitles[1]}
                />
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-tr-[2rem]" />
            </div>
            <div className="relative lg:col-span-2 h-full">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-bl-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
                <div className="flex-1 overflow-y-auto">
                  <Events dashboard={dashboard}/>
                </div>
                <AISummaryCard 
                  section="overview" 
                  userData={{}} 
                  title={dashboard.werknemersPage.BentoGrid.gridTitles[2]}
                />
                
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-bl-[2rem]" />
            </div>
            <div className="relative lg:col-span-2 h-full">
              <div className="absolute inset-px rounded-lg bg-white" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                <div className="flex-1 overflow-y-auto">
                  <Checkout dashboard={dashboard}/>
                </div>
                <AISummaryCard 
                  section="applications" 
                  userData={{}} 
                  title={dashboard.werknemersPage.BentoGrid.gridTitles[3]}
                />
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5" />
            </div>
            <div className="relative lg:col-span-2 h-full">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
                <div className="flex-1 overflow-y-auto">
                  <Financien lang={lang} dashboard={dashboard}/>
                </div>
                <AISummaryCard 
                  section="overview" 
                  userData={{}} 
                  title={dashboard.werknemersPage.BentoGrid.gridTitles[4]}
                />
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  }
  