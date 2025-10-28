"use client";

import { useEffect, useState } from 'react';
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { Iinvoice } from '@/app/lib/models/invoice.model';
import InvoiceCardClient from '@/app/[lang]/components/shared/cards/InvoiceCard';

type Props = {
  factuur: Iinvoice;
  lang: Locale;
};

export default function InvoiceCardWrapper({ factuur, lang }: Props) {
  const [components, setComponents] = useState<any>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const { components: dictComponents } = await getDictionary(lang);
        setComponents(dictComponents);
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

  return <InvoiceCardClient factuur={factuur} components={components} />;
}