'use client';

import React, { useEffect, useState } from 'react'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Shifts from "@/app/[lang]/components/dashboard/EmployeeDashboard/Explore/Wrappers/ShiftsWrapper";
import Vacancies from "@/app/[lang]/components/dashboard/EmployeeDashboard/Explore/Wrappers/VacancyWrapper";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  lang: Locale;
  dashboard?: any;
};

const page = ({ lang, dashboard: propDashboard }: Props) => {
  const [dashboard, setDashboard] = useState<any>(propDashboard);

  useEffect(() => {
    if (propDashboard) {
      setDashboard(propDashboard);
    } else {
      const fetchDictionary = async () => {
        if (lang) {
          const dict = await getDictionary(lang);
          setDashboard(dict);
        }
      };
      fetchDictionary();
    }
  }, [lang, propDashboard]);

  if (!dashboard) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full">
      <Tabs defaultValue="Shifts" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="Shifts" className="w-full">
              {dashboard?.werknemersPage?.Explore?.tabs?.[0] || 'Shifts'}
            </TabsTrigger>
            <TabsTrigger value="Vacancies" className="w-full">
              {dashboard?.werknemersPage?.Explore?.tabs?.[1] || 'Vacancies'}
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="w-full">
          <TabsContent value="Shifts" className="mt-0">
            <Shifts lang={lang} dashboard={dashboard} />
          </TabsContent>
          <TabsContent value="Vacancies" className="mt-0">
            <Vacancies lang={lang} dashboard={dashboard} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default page