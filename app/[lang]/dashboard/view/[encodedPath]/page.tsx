'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/app/[lang]/dictionaries';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

interface ViewPageProps {
  params: Promise<{ 
    lang: string; 
    encodedPath: string; 
  }>;
}

export default function ViewPage({ params }: ViewPageProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const { lang, encodedPath } = await params;
        
        // Validate language
        const validLang = supportedLocales.includes(lang as Locale) ? (lang as Locale) : 'en';
        
        // Decode the base64 encoded path
        const decodedPath = Buffer.from(encodedPath, 'base64').toString('utf-8');
        
        // Construct the full URL with language prefix
        const fullPath = `/${validLang}${decodedPath}`;
        
        // Use router.push instead of redirect
        router.push(fullPath);
      } catch (error) {
        console.error('Error decoding path:', error);
        // Fallback to dashboard if decoding fails
        router.push(`/en/dashboard`);
      }
    };

    handleRedirect();
  }, [params, router]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
