"use client"

import ShiftForm, { AIActions } from '@/app/[lang]/components/shared/forms/ShiftForm';
import { useRef } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useUser } from "@clerk/nextjs";
import DashNav from "@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper";
import Footer from "@/app/[lang]/components/shared/navigation/Footer4";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from "@/app/[lang]/dictionaries";
import { useEffect, useState, use } from 'react';

// Make this route request-bound so Clerk has context
export const dynamic = "force-dynamic";

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

type Props = {
  params: Promise<{ lang: string }>;
};

const MaakShift = ({ params }: Props) => {
  const { user } = useUser();
  const [dashboard, setDashboard] = useState<any>(null);
  const formRef = useRef<AIActions>(null);
  const resolvedParams = use(params);
  const lang = supportedLocales.includes(resolvedParams.lang as Locale) ? (resolvedParams.lang as Locale): 'en';

  useEffect(() => {
    const fetchDictionary = async () => {
      if (lang) {
        const dict = await getDictionary(lang);
        setDashboard(dict);
      }
    };
    fetchDictionary();
  }, [lang]);

  if (!user || !dashboard) {
    return <div>Loading...</div>;
  }

  const userId = user?.id as string;

  return (
    <>
    <DashNav lang={lang} />
      <div className="wrapper my-8 px-4">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] text-center sm:text-left">
                {dashboard?.Shift?.employer?.FormFieldItems?.[0] || 'Create Shift'}
              </h3>
              <p className="text-gray-600 mt-2">Fill out the form below to create a new shift</p>
            </div>
            <button
              type="button"
              onClick={() => formRef.current?.fillWithAI()}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-3 text-white hover:bg-sky-700 transition-colors shadow-sm font-medium"
            >
              <SparklesIcon className="h-5 w-5" />
              AI Fill
            </button>
          </div>
        </div>
        <ShiftForm ref={formRef} userId={userId} type="maak" components={dashboard.components} />
      </div>
    <Footer lang={lang} />
    </>
  )
}

export default MaakShift;