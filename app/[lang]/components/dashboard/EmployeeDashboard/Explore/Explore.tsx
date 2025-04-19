'use client';

import React from 'react'
import { Locale } from '@/i18n.config'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import Shifts from "@/app/[lang]/components/dashboard/EmployeeDashboard/Explore/Shifts";
import Vacancies from "@/app/[lang]/components/dashboard/EmployeeDashboard/Explore/Vacancy";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Tabs defaultValue="Vacancies" className="w-full max-w-4xl ">
        <TabsList className="flex justify-center px-24 bg-white items-center">
          <TabsTrigger value="Shifts">Shifts</TabsTrigger>
          <TabsTrigger value="Vacancies">Vacancies</TabsTrigger>
        </TabsList>
        <section className="mt-6">
          <TabsContent value="Freelancer">
            <Shifts />
          </TabsContent>
          <TabsContent value="Bedrijven">
            <Vacancies />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page