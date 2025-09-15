// app/[lang]/dashboard/employee/financien/FinancienServer.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import FinancienClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/Financien';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function FinancienServer({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);
  return <FinancienClient lang={lang} dashboard={dictionary.dashboard} />;
}
