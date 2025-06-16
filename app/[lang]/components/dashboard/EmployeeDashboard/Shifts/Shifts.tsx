'use client';

import React from 'react'
import { Locale } from '@/i18n.config'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Aangemeld from "@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Aangemeld";
import Aangenomen from "@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Aangenomen";
import Afgerond from "@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Afgerond";

const page = async ({ lang }: { lang: Locale }) => {
  const { dashboard } = await getDictionary(lang);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Tabs defaultValue="Aangenomen" className="w-full max-w-4xl ">
        <TabsList className="flex justify-center px-24 bg-white items-center">
          <TabsTrigger value="Aangemeld">{dashboard.werknemersPage.Shifts.tabs[0]}</TabsTrigger>
          <TabsTrigger value="Aangenomen">{dashboard.werknemersPage.Shifts.tabs[1]}</TabsTrigger>
          <TabsTrigger value="Afgerond">{dashboard.werknemersPage.Shifts.tabs[2]}</TabsTrigger>
        </TabsList>
        <section className="mt-6">
          <TabsContent value="Aangemeld">
            <Aangemeld lang={'en'}/>
          </TabsContent>
          <TabsContent value="Aangenomen">
            <Aangenomen lang={'en'}/>
          </TabsContent>
          <TabsContent value="Afgerond">
            <Afgerond lang={'en'}/>
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page