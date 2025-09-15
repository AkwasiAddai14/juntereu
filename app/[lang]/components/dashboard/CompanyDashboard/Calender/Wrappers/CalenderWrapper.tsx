// app/[lang]/components/dashboard/CompanyDashboard/Calender/Calender.tsx

import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries';
import CalenderClient from '@/app/[lang]/components/dashboard/CompanyDashboard/Calender/Calender';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default async function Calender({ lang }: { lang: Locale }) {
  const { dashboard } = await getDictionary(lang);

  return <CalenderClient dashboard={dashboard} lang={lang} />;
}