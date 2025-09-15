// app/[lang]/components/dashboard/EmployeeDashboard/EmployeeDashboardServer.tsx

import { getDictionary } from '@/app/[lang]/dictionaries';
import EmployeeDashboardClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/Shifts/Dashboard';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


interface Props {
  lang: Locale;
}

export default async function EmployeeDashboardServer({ lang }: Props) {
  const dictionary = await getDictionary(lang);

  return <EmployeeDashboardClient lang={lang} dictionary={dictionary.dashboard} />;
}
