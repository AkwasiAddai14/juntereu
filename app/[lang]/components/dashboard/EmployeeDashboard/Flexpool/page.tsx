'use client';

import React from 'react'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Flexpool from '@/app/[lang]/components/dashboard/EmployeeDashboard/Flexpool/Wrappers/FlexpoolWrappers';
import Favourites from '@/app/[lang]/components/dashboard/EmployeeDashboard/Flexpool/Wrappers/FavouritesWrapper';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys




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
            <Flexpool lang={lang} />
          </TabsContent>
          <TabsContent value="Favourites">
            <Favourites lang={lang} />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page