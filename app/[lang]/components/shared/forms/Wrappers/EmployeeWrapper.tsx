'use client';

import { useUser } from '@clerk/nextjs';
import { getDictionary } from "@/app/[lang]/dictionaries";
import EmployeeFormClient from "@/app/[lang]/components/shared/forms/EmployeeForm";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function EmployeeFormServer({ lang }: { lang: Locale }) {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null; // or a small skeleton

  const dictionary = await getDictionary(lang);

  return (
    <EmployeeFormClient
      lang={lang}
      userId={user!.id ?? ""}
      user={user}
      components={dictionary.components}
    />
  );
}