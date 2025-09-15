// app/[lang]/(vacature)/[id]/page.tsx (of een andere route)
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import VacaturePageClient from '@/app/[lang]/dashboard/vacancies/[id]/client';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function VacaturePagina({ params: { id }, searchParams }: SearchParamProps) {
  const lang = supportedLocales.includes(searchParams.lang as Locale) ? (searchParams.lang as Locale) : 'en';
  const dictionary = await getDictionary(lang);

  return (
    <VacaturePageClient
      id={id}
      lang={lang}
      dictionary={dictionary}
    />
  );
}

