// app/[lang]/components/dashboard/CalenderDServer.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import CalenderDClient from '@/app/[lang]/components/dashboard/CompanyDashboard/Calender/Dag';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default async function CalenderDServer({ lang }: { lang: Locale }) {
  const { dashboard } = await getDictionary(lang);

  return <CalenderDClient dashboard={dashboard} />;
}
