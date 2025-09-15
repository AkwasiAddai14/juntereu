// app/[lang]/(routes)/vacature/page.tsx (bijv.)
import { getDictionary } from '@/app/[lang]/dictionaries';
import VacancyClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Explore/Vacancy';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function VacancyPage({ params }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(params.lang);

  return <VacancyClient lang={params.lang} dashboard={dictionary.dashboard} />;
}
