'use client';

import React, { useEffect, useState } from 'react'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Loonstroken from "@/app/[lang]/components/dashboard/EmployeeDashboard/Financien/Loonstroken";
import Facturen from "@/app/[lang]/components/dashboard/EmployeeDashboard/Financien/Facturen";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  lang: Locale;
  dashboard: any;
};

const Finances = ({ lang, dashboard }: Props) => {
  if (!dashboard) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col items-center">
      <Tabs defaultValue={dashboard.werknemersPage.Financien.Loonstroken} className="w-full max-w-4xl ">
        <TabsList className="flex justify-center px-24 bg-white items-center">
          <TabsTrigger value={dashboard.werknemersPage.Financien.Facturen.headTitle}>{dashboard.werknemersPage.Financien.Facturen.headTitle}</TabsTrigger>
          <TabsTrigger value={dashboard.werknemersPage.Financien.Loonstroken}>{dashboard.werknemersPage.Financien.Loonstroken}</TabsTrigger>
        </TabsList>
        <section className="mt-2">
          <TabsContent value={dashboard.werknemersPage.Financien.Loonstroken}>
            <Loonstroken lang={lang} dashboard={dashboard} />
          </TabsContent>
          <TabsContent value={dashboard.werknemersPage.Financien.Facturen.headTitle}>
            <Facturen lang={lang} dashboard={dashboard} />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default Finances