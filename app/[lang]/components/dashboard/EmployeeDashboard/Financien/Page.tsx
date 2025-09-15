'use client';

import React from 'react'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Loonstroken from "@/app/[lang]/components/dashboard/EmployeeDashboard/Financien/Wrappers/LoonstrokenWrapper";
import Facturen from "@/app/[lang]/components/dashboard/EmployeeDashboard/Financien/Wrappers/FacturenWrapper";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


const page = async ({ lang }: { lang: Locale }) => {
  const { dashboard } = await getDictionary(lang);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Tabs defaultValue={dashboard.werknemersPage.Financien.Loonstroken} className="w-full max-w-4xl ">
        <TabsList className="flex justify-center px-24 bg-white items-center">
          <TabsTrigger value={dashboard.werknemersPage.Financien.Facturen.headTitle}>{dashboard.werknemersPage.Financien.Facturen.headTitle}</TabsTrigger>
          <TabsTrigger value={dashboard.werknemersPage.Financien.Loonstroken}>{dashboard.werknemersPage.Financien.Loonstroken}</TabsTrigger>
        </TabsList>
        <section className="mt-6">
          <TabsContent value={dashboard.werknemersPage.Financien.Loonstroken}>
            <Loonstroken lang={lang} />
          </TabsContent>
          <TabsContent value={dashboard.werknemersPage.Financien.Facturen.headTitle}>
            <Facturen lang={lang} />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page