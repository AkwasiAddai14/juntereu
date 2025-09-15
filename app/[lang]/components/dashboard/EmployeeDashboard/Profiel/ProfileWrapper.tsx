import { getDictionary } from '@/app/[lang]/dictionaries';
import ProfielClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Profiel/Profile';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  lang: Locale;
};

export default async function ProfielServer({ lang }: Props) {
  const { dashboard } = await getDictionary(lang);

  return <ProfielClient dashboard={dashboard} />;
}