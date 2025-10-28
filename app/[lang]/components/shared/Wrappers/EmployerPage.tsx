"use client";

import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import BedrijvenPageClient from '@/app/[lang]/components/shared/EmployerPage';
import DashNav from '@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper';
import { IVacancy } from '@/app/lib/models/vacancy.model';
import { IJob } from '@/app/lib/models/job.model';
import  { IApplication }  from '@/app/lib/models/application.model';
import { useEffect, useState } from 'react';

interface Props {
  vacature: IVacancy;
  diensten: IJob[];
  sollicitaties: IApplication[];
  lang: Locale;
}

export default function BedrijvenPageServer({ vacature, diensten, sollicitaties, lang }: Props) {
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const dict = await getDictionary(lang);
        setDictionary(dict);
      } catch (error) {
        console.error('Error fetching dictionary:', error);
        setDictionary({});
      }
    };

    fetchDictionary();
  }, [lang]);

  if (!dictionary) {
    return <div>Loading...</div>;
  }

  return (
    <BedrijvenPageClient 
      vacature={vacature}
      diensten={diensten}
      sollicitaties={sollicitaties}
      lang={lang}
      dictionary={dictionary}
    />
  );
}