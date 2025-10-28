"use client";

import { useEffect, useState } from 'react';
import { getDictionary } from '@/app/[lang]/dictionaries';
import DropdownPauzeClient from '@/app/[lang]/components/shared/DropdownPauze';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  value?: string;
  onChangeHandler?: (value: string) => void;
  lang: Locale;
};

export default function DropdownPauzeWrapper({ value, onChangeHandler, lang }: Props) {
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const { components } = await getDictionary(lang);
        setOptions(components.shared.DropdownPauze.options);
      } catch (error) {
        console.error('Error fetching dictionary:', error);
        setOptions([]);
      }
    };

    fetchDictionary();
  }, [lang]);

  if (!options.length) {
    return <div>Loading...</div>;
  }

  return (
    <DropdownPauzeClient
      value={value}
      onChangeHandler={onChangeHandler}
      options={options}
    />
  );
}
