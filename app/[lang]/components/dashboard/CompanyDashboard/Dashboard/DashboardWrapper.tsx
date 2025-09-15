// app/[lang]/components/dashboard/CompanyDashboard/DashboardServer.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import DashboardClient from '@/app/[lang]/components/dashboard/CompanyDashboard/Dashboard/dashboard';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default async function DashboardServer({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);

  return <DashboardClient lang={lang} dictionary={dictionary} />;
}