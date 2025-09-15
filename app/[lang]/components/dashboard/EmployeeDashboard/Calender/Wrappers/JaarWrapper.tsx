// app/[lang]/components/dashboard/CompanyDashboard/Calender/CalendarYearViewServer.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import CalendarYearViewClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Calender/Jaar';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function CalendarYearViewServer({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  
  return <CalendarYearViewClient lang={lang} dashboard={dict.dashboard} />;
}
