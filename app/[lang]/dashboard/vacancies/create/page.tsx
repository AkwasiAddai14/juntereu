"use client"

import { useUser } from "@clerk/nextjs";
import VacatureForm from "@/app/[lang]/components/shared/forms/Wrappers/VacancyWrapper"
import DashNav from "@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper";
import Footer from "@/app/[lang]/components/shared/navigation/Footer4";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from "@/app/[lang]/dictionaries";
import { useEffect, useState } from 'react';

// Make this route request-bound so Clerk has context
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

type Props = {
  params: { lang: string };
};

const MaakVacature = ({ params }: Props) => {
  const { user } = useUser();
  const [dashboard, setDashboard] = useState<any>(null);
  const lang = supportedLocales.includes(params.lang as Locale) ? (params.lang as Locale): 'en';

  useEffect(() => {
    const fetchDictionary = async () => {
      if (lang) {
        const dict = await getDictionary(lang);
        setDashboard(dict);
      }
    };
    fetchDictionary();
  }, [lang]);

  if (!dashboard) {
    return <div>Loading...</div>;
  }

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