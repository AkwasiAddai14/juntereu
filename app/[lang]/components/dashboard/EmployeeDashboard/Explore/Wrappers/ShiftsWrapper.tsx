// Servercomponent: app/[lang]/(routes)/shifts/page.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import ShiftsClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Explore/Shifts';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function ShiftsPage({ params }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(params.lang);

  return <ShiftsClient lang={params.lang} dashboard={dictionary.dashboard} />;
}
