// app/[lang]/dashboard/flexpool/[id]/FlexpoolPageServer.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import FlexpoolPageClient from '@/app/[lang]/dashboard/flexpool/employees/[id]/client';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export type SearchParamProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export default async function FlexpoolPage({ params, searchParams }: SearchParamProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const lang = supportedLocales.includes(resolvedSearchParams.lang as Locale)
    ? (resolvedSearchParams.lang as Locale)
    : 'en';
    
  const dictionary = await getDictionary(lang);

  return (
    <FlexpoolPageClient
      id={id}
      lang={lang}
      dashboard={dictionary.dashboard}
      components={dictionary.components}
    />
  );
}
