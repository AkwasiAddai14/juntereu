"use client";

// components/shared/SollicitatieModalWrapper.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import SollicitatieModal from '@/app/[lang]/components/shared/SollicitatieModal';
import { useEffect, useState } from 'react';

interface WrapperProps {
  sollicitatie: any;
  isVisible: boolean;
  lang: Locale;
}

export default function SollicitatieModalWrapper({ sollicitatie, isVisible, lang }: WrapperProps) {
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

  return (
    <SollicitatieModal
      sollicitatie={sollicitatie}
      isVisible={isVisible}
      lang={lang}
      components={components}
    />
  );
}
