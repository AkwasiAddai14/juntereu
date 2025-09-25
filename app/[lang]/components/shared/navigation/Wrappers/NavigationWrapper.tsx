// app/[lang]/components/shared/NavWrapper.tsx
"use client";

import { useState, useEffect } from 'react';
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import NavClient from '@/app/[lang]/components/shared/navigation/NavigationBar';

export default function NavWrapper({ lang }: { lang: Locale }) {
  const [components, setComponents] = useState<any>(null);
  const [pages, setPages] = useState<any>(null);
  const [navigation, setNavigation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const dict = await getDictionary(lang);
        setComponents(dict.components);
        setPages(dict.pages);
        setNavigation(dict.navigation);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dictionary:', error);
        setLoading(false);
      }
    };
    
    fetchDictionary();
  }, [lang]);

  if (loading || !components || !pages || !navigation) {
    return (
      <div className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="hidden lg:flex lg:gap-x-8">
            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="flex items-center gap-x-4">
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-20 bg-sky-600 animate-pulse rounded"></div>
          </div>
        </nav>
      </div>
    );
  }

  return <NavClient lang={lang} components={components} pages={pages} navigation={navigation} />;
}