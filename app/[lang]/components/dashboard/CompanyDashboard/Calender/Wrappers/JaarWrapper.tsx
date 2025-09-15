// app/[lang]/(dashboard)/dashboard/components/CalenderJaarServer.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import CalenderJaarClient from '@/app/[lang]/components/dashboard/CompanyDashboard/Calender/Jaar';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default async function CalenderJaarServer({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);
  return <CalenderJaarClient lang={lang} dictionary={dictionary} />;
}
