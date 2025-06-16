'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Locale } from '@/i18n.config';


export default function AuthRedirect() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const supportedLocales: Locale[] = [
    'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
    'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
  ];

  useEffect(() => {
    if (isLoaded && user) {
      router.push('/dashboard', { scroll: false });
    }
  }, [isLoaded, user]);

  
  useEffect(() => {
    const lang = pathname.split('/')[1]
    if (!supportedLocales.includes(lang as any)) {
      router.replace(`/en${pathname}`)
    }
  }, [pathname])

  return null; // nothing rendered; just redirects if needed
};