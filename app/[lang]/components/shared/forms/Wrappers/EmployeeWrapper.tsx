'use client';

import { useUser } from '@clerk/nextjs';
import { getDictionary } from "@/app/[lang]/dictionaries";
import EmployeeFormClient from "@/app/[lang]/components/shared/forms/EmployeeForm";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { useEffect, useState } from 'react';

export default function EmployeeFormServer({ lang }: { lang: Locale }) {
  const { user, isLoaded } = useUser();
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary(dict);
    };
    fetchDictionary();
  }, [lang]);

  if (!isLoaded || !dictionary) return null; // or a small skeleton

  return (
    <EmployeeFormClient
      lang={lang}
      userId={user!.id ?? ""}
      user={user}
      components={dictionary.components}
    />
  );
}