import { getDictionary } from '@/app/[lang]/dictionaries';
import VeelgesteldeVragen from './client';
import type { Locale } from '@/app/[lang]/dictionaries';

type Props = {
  params: Promise<{ lang: Locale }>;
};

export default async function FAQPage({ params }: Props) {
  const resolvedParams = await params;
  const { dashboard } = await getDictionary(resolvedParams.lang);

  return <VeelgesteldeVragen lang={resolvedParams.lang} dashboard={dashboard} />;
}
