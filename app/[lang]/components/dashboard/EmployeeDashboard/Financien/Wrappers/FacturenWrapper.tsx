// app/[lang]/(routes)/financien/FinancienServer.tsx

import { getDictionary } from '@/app/[lang]/dictionaries';
import FinancienClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Financien/Facturen';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


type Props = {
  lang: Locale;
};

export default async function FinancienServer({ lang }: Props) {
  const { dashboard } = await getDictionary(lang);
  return <FinancienClient lang={lang} dashboard={dashboard} />;
}