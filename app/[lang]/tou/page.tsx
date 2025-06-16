import React from 'react';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/[lang]/components/ui/tabs";
import AVfreelancers from "@/app/[lang]/tou/AVEmployees";
import AVbedrijven from "@/app/[lang]/tou/AVEmployers";

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
  'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
];

const page = async ({ params }: { params: { lang: string } }) => {
  const lang = supportedLocales.includes(params.lang as Locale) ? (params.lang as Locale) : 'en';
  const { pages } = await getDictionary(lang);

  return (
    <div className="mt-20 flex flex-col justify-center items-center min-h-screen">
      <Tabs defaultValue="Bedrijven" className="w-full max-w-4xl ">
        <TabsList className="flex justify-center px-24 bg-white items-center">
          <TabsTrigger value="Freelancer">{pages.termsofusePage.tabFreelancers}</TabsTrigger>
          <TabsTrigger value="Bedrijven">{pages.termsofusePage.tabBedrijven}</TabsTrigger>
        </TabsList>
        <section className="mt-6">
          <TabsContent value="Freelancer">
            <AVfreelancers params={{
              lang: lang
            }} />
          </TabsContent>
          <TabsContent value="Bedrijven">
            <AVbedrijven params={{
              lang: lang
            }} />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default page