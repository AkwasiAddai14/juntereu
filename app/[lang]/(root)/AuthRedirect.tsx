'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Locale } from '@/app/[lang]/dictionaries';
import { useClerkAvailable } from './ClerkAvailableContext';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH'
];

type Props = {
  params: { lang: Locale };
};

function AuthRedirectInner({ params }: Props) {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const { lang } = params;

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        router.push(`/${lang}/dashboard`, { scroll: false });
      } else {
        router.push(`/${lang}`, { scroll: false });
      }
    }
  }, [isLoaded, user, lang, router]);

  return null;
}

export default function AuthRedirect({ params }: Props) {
  const clerkAvailable = useClerkAvailable();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const lang = pathname ? pathname.split('/')[1] : '';
    if (pathname && lang && !supportedLocales.includes(lang as Locale)) {
      router.replace(pathname);
    }
  }, [pathname, router]);

  if (!clerkAvailable) {
    return null;
  }

  return <AuthRedirectInner params={params} />;
}