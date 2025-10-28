// app/[lang]/dashboard/shiftDetails/page.tsx (of een vergelijkbare route)
import { getDictionary } from '@/app/[lang]/dictionaries';
import ShiftDetailsClient from '@/app/[lang]/dashboard/shift/employer/[id]/client';
import { haalShiftMetId } from '@/app/lib/actions/shift.actions';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export type SearchParamProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default async function ShiftDetailsPage({
  params,
  searchParams,
}: SearchParamProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  
  const lang = supportedLocales.includes(resolvedSearchParams.lang as Locale)
    ? (resolvedSearchParams.lang as Locale)
    : 'en';
  const { dashboard } = await getDictionary(lang);

  // Fetch shift data (now properly serialized in the action)
  const shift = await haalShiftMetId(id);

  return (
    <ShiftDetailsClient
      id={id}
      lang={lang}
      dashboard={dashboard}
      shift={shift}
    />
  );
}