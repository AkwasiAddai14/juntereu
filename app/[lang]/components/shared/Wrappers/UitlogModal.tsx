"use client";

import { getDictionary } from '@/app/[lang]/dictionaries';
import UitlogModal from '@/app/[lang]/components/shared/UitlogModal';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { lang: Locale } }) {
  const [components, setComponents] = useState<any>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const dict = await getDictionary(params.lang);
        setComponents(dict.components);
      } catch (error) {
        console.error('Error fetching dictionary:', error);
        setComponents({});
      }
    };

    fetchDictionary();
  }, [params.lang]);

  if (!components) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      {/* andere content */}
      <UitlogModal isVisible={true} onClose={() => {}} components={components} />
    </main>
  );
}