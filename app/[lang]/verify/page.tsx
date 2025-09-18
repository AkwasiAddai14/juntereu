'use client'

import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries'
import Example from './VerifyForm';
import { useEffect, useState } from 'react';

// Make this route request-bound so Clerk has context
export const dynamic = "force-dynamic";

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH', 'os',
];

type Props = {
  params: { lang: Locale };
};

export default function VerifyPage({ params }: Props) {
  const [dictionary, setDictionary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        if (params.lang && supportedLocales.includes(params.lang)) {
          const dict = await getDictionary(params.lang);
          setDictionary(dict);
        } else {
          // Fallback to English if locale not supported
          const dict = await getDictionary('en');
          setDictionary(dict);
        }
      } catch (error) {
        console.error('Error loading dictionary:', error);
        // Fallback to English on error
        try {
          const dict = await getDictionary('en');
          setDictionary(dict);
        } catch (fallbackError) {
          console.error('Error loading fallback dictionary:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDictionary();
  }, [params.lang]);

  if (loading || !dictionary) {
    return <div>Loading...</div>;
  }

  const { pages, navigation, footer } = dictionary;

  return <Example pages={pages} navigation={navigation} footer={footer} params={{
    lang: params.lang
  }} />;
}