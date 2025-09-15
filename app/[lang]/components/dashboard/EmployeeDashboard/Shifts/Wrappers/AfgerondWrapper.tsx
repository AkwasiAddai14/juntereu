import { getDictionary } from '@/app/[lang]/dictionaries';
import AfgerondClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Afgerond';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  lang: Locale;
};

export default async function AfgerondServer({ lang }: Props) {
  const dictionary = await getDictionary(lang);

  return <AfgerondClient lang={lang} dashboard={dictionary.dashboard} />;
}