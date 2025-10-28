"use client";

import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import WerknemerPageClient from '@/app/[lang]/components/shared/EmployeePage';
import DashNav from '@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper';
import { useEffect, useState } from 'react';

interface WerknemerPageProps {
  vacature: any;
  diensten: any[];
  lang: Locale;
}

export default function WerknemerPageServer({ vacature, diensten, lang }: WerknemerPageProps) {
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
    <WerknemerPageClient
      vacature={vacature}
      diensten={diensten}
      lang={lang}
      dictionary={dictionary}
    />
  );
}
