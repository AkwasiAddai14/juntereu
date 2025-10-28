"use client";

// components/SollicitatiesWrapper.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import { Sollicitaties } from '@/app/[lang]/components/shared/Sollicitaties'; // nieuwe naam voor de client component
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { useEffect, useState } from 'react';

export default function SollicitatiesWrapper({
  sollicitaties,
  lang,
}: {
  sollicitaties: any;
  lang: Locale;
}) {
  const [components, setComponents] = useState<any>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const dict = await getDictionary(lang);
        setComponents(dict.components);
      } catch (error) {
        console.error('Error fetching dictionary:', error);
        setComponents({});
      }
    };

    fetchDictionary();
  }, [lang]);

  if (!components) {
    return <div>Loading...</div>;
  }

  return <Sollicitaties sollicitaties={sollicitaties} lang={lang} components={components} />;
}