// app/[lang]/factuur/[id]/page.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import FactuurClient from '@/app/[lang]/dashboard/invoice/employees/[id]/client';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

export default async function FactuurPage({ params }: { params: { lang: Locale, id: string } }) {
  const lang = params.lang;
  const { dashboard } = await getDictionary(lang);

  return (
    <FactuurClient id={params.id} lang={lang} dashboard={dashboard} />
  );
}
