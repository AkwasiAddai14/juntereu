'use client';

import React from 'react'
import { Locale } from '@/i18n.config'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Loonstroken from "@/app/[lang]/components/dashboard/EmployeeDashboard/Financien/Loonstroken";
import Facturen from "@/app/[lang]/components/dashboard/EmployeeDashboard/Financien/Facturen";

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
            <Loonstroken lang={'en'} />
          </TabsContent>
          <TabsContent value={dashboard.werknemersPage.Financien.Facturen.headTitle}>
            <Facturen lang={'en'} />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page