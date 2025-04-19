'use client';

import React from 'react'
import { Locale } from '@/i18n.config'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import AVfreelancers from "@/app/[lang]/tou/AVEmployees";
import AVbedrijven from "@/app/[lang]/tou/AVEmployers";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Tabs defaultValue="Freelancer" className="w-full max-w-4xl ">
        <TabsList className="flex justify-center px-24 bg-white items-center">
          <TabsTrigger value="Freelancer">Freelancers</TabsTrigger>
          <TabsTrigger value="Bedrijven">Bedrijven</TabsTrigger>
        </TabsList>
        <section className="mt-6">
          <TabsContent value="Freelancer">
            <AVfreelancers />
          </TabsContent>
          <TabsContent value="Bedrijven">
            <AVbedrijven />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page