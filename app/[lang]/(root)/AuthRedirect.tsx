'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  params: {
    lang: Locale;
  };
};


export default function AuthRedirect({ params }: Props) {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const supportedLocales: Locale[] = [
    'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
    'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH'
  ];
  
  const { lang } = params;
  //console.log(navigator.language.split('-')[0])
  const href = supportedLocales.includes(params.lang as Locale)
  ? (params.lang as Locale)
  : '/en'

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        router.push(`/${lang}/dashboard`, { scroll: false });
      } else {
        router.push(`/${lang}`, { scroll: false });
      }
    }
  }, [isLoaded, user, lang, router]);

console.log("user: ", user)
 /*  useEffect(() => {
    const browserLang = navigator.language.split('-')[0]; // bijv. 'nl' uit 'nl-NL'

    // fallback naar 'en' als taal niet ondersteund is
    const lang = supportedLocales.includes(browserLang as Locale) ? browserLang : 'en';

    router.replace(`/${lang}`);
  }, [router]); */

  //return null; // Je toont niets tijdens de redirect

  
  useEffect(() => {
    const lang = pathname ? pathname.split('/')[1] : '';
    if (pathname && !supportedLocales.includes(lang as any)) {
      router.replace(`/${pathname}`)
    }
  }, [pathname])

  return null; // nothing rendered; just redirects if needed
};