// app/[lang]/(routes)/flexpool/FlexpoolServer.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import FlexpoolClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Flexpool/Flexpool';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function FlexpoolServer({ lang }: { lang: Locale }) {
  const { dashboard } = await getDictionary(lang);

  return <FlexpoolClient lang={lang} dashboard={dashboard} />;
}