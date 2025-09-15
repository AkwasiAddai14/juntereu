// app/[lang]/dashboard/shiftDetails/page.tsx (of een vergelijkbare route)
import { getDictionary } from '@/app/[lang]/dictionaries';
import ShiftDetailsClient from '@/app/[lang]/dashboard/shift/employer/[id]/client';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default async function ShiftDetailsPage({
  params,
  searchParams,
}: SearchParamProps) {
  const lang = supportedLocales.includes(searchParams.lang as Locale)
    ? (searchParams.lang as Locale)
    : 'en';
  const { dashboard } = await getDictionary(lang);

  return (
    <ShiftDetailsClient
      id={params.id}
      lang={lang}
      dashboard={dashboard}
    />
  );
}