import { getDictionary } from '@/app/[lang]/dictionaries';
import AangenomenClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Shifts/Aangenomen';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


type Props = {
  lang: Locale;
};

export default async function AangenomenServer({ lang }: Props) {
  const dictionary = await getDictionary(lang);

  return <AangenomenClient lang={lang} dashboard={dictionary.dashboard} />;
}