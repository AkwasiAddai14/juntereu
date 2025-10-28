// app/[lang]/(vacature)/[id]/page.tsx (of een andere route)
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import VacaturePageClient from '@/app/[lang]/dashboard/vacancies/[id]/client';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export type SearchParamProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VacaturePagina({ params, searchParams }: SearchParamProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const lang = supportedLocales.includes(resolvedSearchParams.lang as Locale) ? (resolvedSearchParams.lang as Locale) : 'en';
  const dictionary = await getDictionary(lang);

  return (
    <VacaturePageClient
      id={id}
      lang={lang}
      dictionary={dictionary}
    />
  );
}

