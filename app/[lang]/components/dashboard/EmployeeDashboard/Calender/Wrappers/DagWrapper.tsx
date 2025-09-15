// app/[lang]/components/dashboard/CompanyDashboard/Calender/CalenderDServer.tsx
import CalenderDClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Calender/Dag';
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function CalenderDServer({ lang }: { lang: Locale }) {
  const { dashboard } = await getDictionary(lang);

  return <CalenderDClient dashboard={dashboard} lang={lang} />;
}