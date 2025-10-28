"use client";

import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import DienstensectieClient from '@/app/[lang]/components/shared/Dienstensectie';
import { IJob } from '@/app/lib/models/job.model';
import { useEffect, useState } from 'react';

interface DienstenSectiePageProps {
  diensten: IJob[];
  lang: Locale;
}

export default function DienstensectieServer({ diensten, lang }: DienstenSectiePageProps) {
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

  return <DienstensectieClient diensten={diensten} lang={lang} dictionary={dictionary} />;
}