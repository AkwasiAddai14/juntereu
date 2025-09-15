// app/[lang]/components/dashboard/EmployeeDashboard/Calender/CalenderPage.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import CalenderClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Calender/Calender';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


interface CalenderPageProps {
  lang: Locale;
}

export default async function CalenderPage({ lang }: CalenderPageProps) {
  const { dashboard } = await getDictionary(lang);
  return <CalenderClient lang={lang} dashboard={dashboard} />;
}
