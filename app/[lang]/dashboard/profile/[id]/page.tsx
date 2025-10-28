import { getDictionary } from '@/app/[lang]/dictionaries';
import ProfielClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Profiel/Profile';
import type { Locale } from '@/app/[lang]/dictionaries';

type Props = {
  params: Promise<{ lang: Locale; id: string }>;
};

export default async function ProfielServer({ params }: Props) {
  const resolvedParams = await params;
  const { dashboard } = await getDictionary(resolvedParams.lang);

  return <ProfielClient dashboard={dashboard} />;
}