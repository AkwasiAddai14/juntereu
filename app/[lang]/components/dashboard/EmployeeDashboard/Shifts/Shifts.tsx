'use client';

import React from 'react'
import { Locale } from '@/i18n.config'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Aangemeld from "@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Aangemeld";
import Aangenomen from "@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Aangenomen";
import Afgerond from "@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Afgerond";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Tabs defaultValue="Freelancer" className="w-full max-w-4xl ">
        <TabsList className="flex justify-center px-24 bg-white items-center">
          <TabsTrigger value="Aangemeld">Aangemeld</TabsTrigger>
          <TabsTrigger value="Aangenomen">Aangenomen</TabsTrigger>
          <TabsTrigger value="Afgerond">Afgerond</TabsTrigger>
        </TabsList>
        <section className="mt-6">
          <TabsContent value="Freelancer">
            <Aangemeld/>
          </TabsContent>
          <TabsContent value="Bedrijven">
            <Aangenomen/>
          </TabsContent>
          <TabsContent value="Bedrijven">
            <Afgerond/>
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page