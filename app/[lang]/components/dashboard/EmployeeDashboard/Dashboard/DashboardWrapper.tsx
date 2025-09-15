// app/[lang]/(dashboard)/EmployeeDashboardServer.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import EmployeeDashboardClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Dashboard/dashboard';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function EmployeeDashboardServer({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);

  return <EmployeeDashboardClient lang={lang} dashboard={dictionary.dashboard} />;
}
