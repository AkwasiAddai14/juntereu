import { getDictionary } from '@/app/[lang]/dictionaries';
import AangemeldClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Aangemeld';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


type Props = {
  lang: Locale;
};

export default async function AangemeldServer({ lang }: Props) {
  const dictionary = await getDictionary(lang);

  return <AangemeldClient lang={lang} dashboard={dictionary.dashboard} />;
}