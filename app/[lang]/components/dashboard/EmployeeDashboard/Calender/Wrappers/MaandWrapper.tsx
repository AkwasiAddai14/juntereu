// app/[lang]/components/dashboard/CompanyDashboard/Calender/CalenderMServer.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import CalenderMClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Calender/Maand';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


const CalenderMServer = async ({ lang }: { lang: Locale }) => {
  const dictionary = await getDictionary(lang);

  return <CalenderMClient lang={lang} dictionary={dictionary} />;
};

export default CalenderMServer;
