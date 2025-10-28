"use client";

import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { ApplyConfirmation } from '@/app/[lang]/components/shared/ApplyConfirmation';
import { useEffect, useState } from 'react';

export default function ApplyConfirmationWrapper({
  shiftId,
  lang,
}: {
  shiftId: string;
  lang: Locale;
}) {
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

  return <ApplyConfirmation shiftId={shiftId} lang={lang} dictionary={dictionary} />;
}
