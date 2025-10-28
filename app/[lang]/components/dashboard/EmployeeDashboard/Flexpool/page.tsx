'use client';

import React, { useEffect, useState } from 'react';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Flexpool from '@/app/[lang]/components/dashboard/EmployeeDashboard/Flexpool/Flexpool';
import Favourites from '@/app/[lang]/components/dashboard/EmployeeDashboard/Flexpool/Favourites';

type Props = {
  lang: Locale;
  dashboard: any;
};

const flexpool = ({ lang, dashboard }: Props) => {
  if (!dashboard) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <Tabs defaultValue="Flexpool" className="w-full max-w-4xl ">
        <TabsList className="flex justify-center px-24 bg-white items-center">
          <TabsTrigger value="Flexpool">{dashboard.werknemersPage.Flexpool.Flexpools.headTitle}</TabsTrigger>
          <TabsTrigger value="Favourites">{dashboard.werknemersPage.Flexpool.Favorieten.headTitle}</TabsTrigger>
        </TabsList>
        <section className="mt-2">
          <TabsContent value="Flexpool">
            <Flexpool lang={lang} dashboard={dashboard} />
          </TabsContent>
          <TabsContent value="Favourites">
            <Favourites lang={lang} dashboard={dashboard} />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default flexpool