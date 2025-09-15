// app/[lang]/dashboard/invoice/[id]/page.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import FactuurClientComponent from '@/app/[lang]/dashboard/invoice/employers/[id]/client';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default async function FactuurBedrijfPage({ params, searchParams }: SearchParamProps) {
  const lang = supportedLocales.includes(searchParams.lang as Locale) ? (searchParams.lang as Locale) : 'en';
  const { dashboard, components } = await getDictionary(lang);

  return (
    <FactuurClientComponent
      id={params.id}
      lang={lang}
      dashboard={dashboard}
      components={components}
    />
  );
}
