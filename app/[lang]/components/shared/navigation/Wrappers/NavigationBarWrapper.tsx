// app/[lang]/components/shared/NavWrapper.tsx
"use client";

import { useEffect, useState } from 'react';
import { getDictionary } from '@/app/[lang]/dictionaries';
import NavClient from '@/app/[lang]/components/shared/navigation/NavigationBar';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

export default function NavWrapper({ lang }: { lang: Locale }) {
  const [dictionary, setDictionary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const dict = await getDictionary(lang);
        setDictionary(dict);
      } catch (error) {
        console.error('Error fetching dictionary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDictionary();
  }, [lang]);

  if (loading || !dictionary) {
    return (
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { pages, navigation, components } = dictionary;
  return <NavClient lang={lang} pages={pages} navigation={navigation} components={components} />;
}