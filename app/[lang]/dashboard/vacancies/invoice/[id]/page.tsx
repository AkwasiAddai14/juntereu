// app/[lang]/dashboard/facturen/factuurBedrijf/page.tsx
import { getDictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import FactuurClient from "@/app/[lang]/dashboard/vacancies/invoice/[id]/client";

export type SearchParamProps = {
  params: { id: string; lang: Locale };
  searchParams: { [key: string]: string | string[] | undefined };
};

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default async function FactuurBedrijfPage({ params: { id, lang } }: SearchParamProps) {
  const validLang = supportedLocales.includes(lang) ? lang : "en";
  const dict = await getDictionary(validLang);
  
  return <FactuurClient id={id} lang={validLang} dictionary={dict} />;
}
