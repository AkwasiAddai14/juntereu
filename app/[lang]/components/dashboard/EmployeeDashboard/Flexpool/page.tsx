'use client';

import React from 'react'
import { Locale } from '@/i18n.config'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Flexpool from '@/app/[lang]/components/dashboard/EmployeeDashboard/Flexpool/Flexpool';
import Favourites from '@/app/[lang]/components/dashboard/EmployeeDashboard/Flexpool/Favourites';



const page = async ({ lang }: { lang: Locale }) => {
  const { dashboard } = await getDictionary(lang);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Tabs defaultValue="Flexpool" className="w-full max-w-4xl ">
        <TabsList className="flex justify-center px-24 bg-white items-center">
          <TabsTrigger value="Flexpool">{dashboard.werknemersPage.Flexpool.Flexpools.headTitle}</TabsTrigger>
          <TabsTrigger value="Favourites">{dashboard.werknemersPage.Flexpool.Favorieten.headTitle}</TabsTrigger>
        </TabsList>
        <section className="mt-6">
          <TabsContent value="Flexpool">
            <Flexpool lang={'en'} />
          </TabsContent>
          <TabsContent value="Favourites">
            <Favourites lang={'en'} />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page