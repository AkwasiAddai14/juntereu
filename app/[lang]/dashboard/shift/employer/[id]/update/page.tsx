'use client';

import { useEffect, useState } from 'react';
import ShiftForm from "@/app/[lang]/components/shared/forms/Wrappers/ShiftWrapper";
import { haalShiftMetId } from "@/app/lib/actions/shift.actions"
import Footer from "@/app/[lang]/components/shared/navigation/Footer4";
import { fetchBedrijfClerkId } from "@/app/lib/actions/employer.actions";
import dynamic from 'next/dynamic';
import { getDictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

const DashNav = dynamic(() => import('@/app/[lang]/components/shared/navigation//Wrappers/NavigationWrapper'), {
  ssr: false
});


type UpdateEventProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const UpdateEvent = ({ params, searchParams }: UpdateEventProps) => {
  const [data, setData] = useState<{
    lang: Locale;
    dashboard: any;
    shift: any;
    bedrijf: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id } = await params;
        const resolvedSearchParams = await searchParams;
        const lang = supportedLocales.includes(resolvedSearchParams.lang as Locale) ? (resolvedSearchParams.lang as Locale): 'en';
        const { dashboard } = await getDictionary(lang);
        const shift = await haalShiftMetId(id);
        const bedrijf = await fetchBedrijfClerkId(shift.employer as unknown as string);
        
        setData({ lang, dashboard, shift, bedrijf });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params, searchParams]);

  if (loading || !data) {
    return <div>Loading...</div>;
  }

  const { lang, dashboard, shift, bedrijf } = data;

  return (
    <>
    <DashNav lang={lang} />
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">{dashboard.Shift.employer.FormFieldItems[7]}</h3>
      </section>
      <div className="wrapper my-8">
        <ShiftForm 
          type="update"
          shift={shift}
          shiftId={shift._id as unknown as string}
          userId={bedrijf} lang={lang}        
          />
      </div>
      <Footer lang={lang}/>
    </>
  )
}

export default UpdateEvent