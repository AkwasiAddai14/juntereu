"use client"

import { useUser } from "@clerk/nextjs";
import VacatureForm from "@/app/[lang]/components/shared/forms/Wrappers/VacancyWrapper"
import DashNav from "@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper";
import Footer from "@/app/[lang]/components/shared/navigation/Footer4";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from "@/app/[lang]/dictionaries";

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];


const MaakVacature = async ({ params }: { params: { lang: string } }) => {
  const { user } = useUser();
  const lang = supportedLocales.includes(params.lang as Locale) ? (params.lang as Locale): 'en';
  const { dashboard } = await getDictionary(lang);

  const userId = user?.id as string;

  return (
    <>
    <DashNav lang={lang} />
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper font-bold text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] text-center sm:text-left">{dashboard.Vacancies.FormFieldItems[0]}</h3>
      </section>
      <div className="wrapper my-8">
        <VacatureForm userId={userId} type="maak" lang={lang}  />
      </div>
    <Footer lang={lang} />
    </>
  )
}

export default MaakVacature;