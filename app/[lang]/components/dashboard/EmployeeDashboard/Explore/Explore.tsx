'use client';

import React from 'react'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Shifts from "@/app/[lang]/components/dashboard/EmployeeDashboard/Explore/Wrappers/ShiftsWrapper";
import Vacancies from "@/app/[lang]/components/dashboard/EmployeeDashboard/Explore/Wrappers/VacancyWrapper";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


const page = async ({ lang }: { lang: Locale }) => {
  const { dashboard } = await getDictionary(lang);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Tabs defaultValue="Vacancies" className="w-full max-w-4xl ">
        <TabsList className="flex justify-center px-24 bg-white items-center">
          <TabsTrigger value="Shifts">{dashboard.werknemersPage.Explore.tabs[0]}</TabsTrigger>
          <TabsTrigger value="Vacancies">{dashboard.werknemersPage.Explore.tabs[1]}</TabsTrigger>
        </TabsList>
        <section className="mt-6">
          <TabsContent value={dashboard.werknemersPage.Explore.tabs[0]}>
            <Shifts params={{
              lang: lang
            }} />
          </TabsContent>
          <TabsContent value={dashboard.werknemersPage.Explore.tabs[1]}>
            <Vacancies params={{
              lang: lang
            }}  />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page