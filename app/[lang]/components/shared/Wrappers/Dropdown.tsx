"use client";

// DropdownWrapper.tsx
import { useEffect, useState } from 'react';
import { getDictionary } from '@/app/[lang]/dictionaries';
import DropdownClient from '@/app/[lang]/components/shared/Dropdown';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  value?: string;
  onChangeHandler?: (value: string) => void;
  flexpoolsList: string[];
  userId: string;
  lang: Locale;
};

export default function DropdownWrapper(props: Props) {
  const { lang, ...rest } = props;
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

  return <DropdownClient {...rest} components={components} />;
}
