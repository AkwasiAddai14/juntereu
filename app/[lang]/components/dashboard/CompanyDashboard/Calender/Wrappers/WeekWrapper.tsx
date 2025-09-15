// app/[lang]/(platform)/dashboard/(routes)/calendar/CalenderWServer.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import CalenderWClient from '@/app/[lang]/components/dashboard/CompanyDashboard/Calender/Week';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default async function CalenderWServer({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);

  return <CalenderWClient lang={lang} dictionary={dictionary} />;
}
