'use client';

import React, { useEffect, useState } from 'react'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Aangemeld from "@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Wrappers/AangemeldWrapper";
import Aangenomen from "@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Wrappers/AangenomenWrapper";
import Afgerond from "@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Wrappers/AfgerondWrapper";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  lang: Locale;
};

const page = ({ lang }: Props) => {
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
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Tabs defaultValue="Aangenomen" className="w-full max-w-4xl ">
        <TabsList className="flex justify-center px-24 bg-white items-center">
          <TabsTrigger value="Aangemeld">{dashboard.werknemersPage.Shifts.tabs[0]}</TabsTrigger>
          <TabsTrigger value="Aangenomen">{dashboard.werknemersPage.Shifts.tabs[1]}</TabsTrigger>
          <TabsTrigger value="Afgerond">{dashboard.werknemersPage.Shifts.tabs[2]}</TabsTrigger>
        </TabsList>
        <section className="mt-6">
          <TabsContent value="Aangemeld">
            <Aangemeld lang={lang}/>
          </TabsContent>
          <TabsContent value="Aangenomen">
            <Aangenomen lang={lang}/>
          </TabsContent>
          <TabsContent value="Afgerond">
            <Afgerond lang={lang}/>
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page