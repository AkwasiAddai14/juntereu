"use client";

import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import CheckoutClient from '@/app/[lang]/components/shared/CheckoutModal';
import { useEffect, useState } from 'react';

interface CheckoutWrapperProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
  isVisible: boolean;
  onClose: () => void;
  lang: Locale;
}

export default function CheckoutWrapper({ params, isVisible, onClose, lang }: CheckoutWrapperProps) {
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
    <CheckoutClient
      shiftId={params.id}
      lang={lang}
      isVisible={isVisible}
      onClose={onClose}
      components={components}
    />
  );
}
