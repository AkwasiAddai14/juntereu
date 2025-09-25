'use client';

import { useUser } from '@clerk/nextjs';
import { getDictionary } from "@/app/[lang]/dictionaries";
import EmployeeFormClient from "@/app/[lang]/components/shared/forms/EmployeeForm";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { useEffect, useState } from 'react';

export default function EmployeeFormServer({ lang }: { lang: Locale }) {
  const { user, isLoaded } = useUser();
  const [components, setComponents] = useState<any>(null);
  const [validations, setValidations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const dict = await getDictionary(lang);
        setComponents(dict.components);
        setValidations(dict.Validations);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dictionary:', error);
        setLoading(false);
      }
    };
    
    fetchDictionary();
  }, [lang]);

    if (!isLoaded || loading || !components || !validations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <EmployeeFormClient
      lang={lang}
      userId={user!.id ?? ""}
      user={user}
      components={components}
    />
  );
}