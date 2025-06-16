'use client';

import React from 'react'
import { Locale } from '@/i18n.config'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Shifts from "@/app/[lang]/components/dashboard/EmployeeDashboard/Explore/Shifts";
import Vacancies from "@/app/[lang]/components/dashboard/EmployeeDashboard/Explore/Vacancy";

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
            <Shifts lang={'en'} />
          </TabsContent>
          <TabsContent value={dashboard.werknemersPage.Explore.tabs[1]}>
            <Vacancies lang={'en'} />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page