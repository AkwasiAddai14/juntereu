// app/[lang]/dashboard/flexpool/page.tsx (of FlexpoolPageServer.tsx)
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries';
import FlexpoolPageClient from '@/app/[lang]/dashboard/flexpool/employers/[id]/client';

export type SearchParamProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default async function FlexpoolPageServer({ params, searchParams }: SearchParamProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const lang = supportedLocales.includes(resolvedSearchParams.lang as Locale) ? (resolvedSearchParams.lang as Locale) : 'en';
  const { dashboard } = await getDictionary(lang);

  return <FlexpoolPageClient id={id} lang={lang} dashboard={dashboard} />;
}