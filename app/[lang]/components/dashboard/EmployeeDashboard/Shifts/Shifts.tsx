'use client';

import React, { useEffect, useState } from 'react'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Aangemeld from "@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Aangemeld";
import Aangenomen from "@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Aangenomen";
import Afgerond from "@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Afgerond";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  lang: Locale;
  dashboard: any;
};

const page = ({ lang, dashboard }: Props) => {
  if (!dashboard) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col items-center">
      <Tabs defaultValue="Aangenomen" className="w-full max-w-4xl ">
        <TabsList className="flex justify-center px-24 bg-white items-center">
          <TabsTrigger value="Aangemeld">{dashboard.werknemersPage.Shifts.tabs[0]}</TabsTrigger>
          <TabsTrigger value="Aangenomen">{dashboard.werknemersPage.Shifts.tabs[1]}</TabsTrigger>
          <TabsTrigger value="Afgerond">{dashboard.werknemersPage.Shifts.tabs[2]}</TabsTrigger>
        </TabsList>
        <section className="mt-2">
          <TabsContent value="Aangemeld">
            <Aangemeld lang={lang} dashboard={dashboard}/>
          </TabsContent>
          <TabsContent value="Aangenomen">
            <Aangenomen lang={lang} dashboard={dashboard}/>
          </TabsContent>
          <TabsContent value="Afgerond">
            <Afgerond lang={lang} dashboard={dashboard}/>
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page