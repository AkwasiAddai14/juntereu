// app/[lang]/dashboard/flexpool/page.tsx (of FlexpoolPageServer.tsx)
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries';
import FlexpoolPageClient from '@/app/[lang]/dashboard/flexpool/employers/[id]/client';

export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default async function FlexpoolPageServer({ params, searchParams }: SearchParamProps) {
  const lang = supportedLocales.includes(searchParams.lang as Locale) ? (searchParams.lang as Locale) : 'en';
  const { dashboard } = await getDictionary(lang);

  return <FlexpoolPageClient id={params.id} lang={lang} dashboard={dashboard} />;
}