"use client";

// DropdownCategorieWrapper.tsx
import { useEffect, useState } from 'react';
import { getDictionary } from '@/app/[lang]/dictionaries';
import DropdownCategorieClient from '@/app/[lang]/components/shared/DropdownCategorie';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  value?: string;
  onChangeHandler?: (value: string) => void;
  lang: Locale;
};

export default function DropdownCategorieWrapper({ value, onChangeHandler, lang }: Props) {
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
    <DropdownCategorieClient
      value={value}
      onChangeHandler={onChangeHandler}
      components={components}
    />
  );
}