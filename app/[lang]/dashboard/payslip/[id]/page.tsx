// app/[lang]/(dashboard)/payslip/[id]/page.tsx
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries';
import PayslipClient from '@/app/[lang]/dashboard/payslip/[id]/client';

export default async function PayslipPage({ params }: { params: { lang: Locale; id: string } }) {
  const dictionary = await getDictionary(params.lang);
  return <PayslipClient lang={params.lang} id={params.id} dictionary={dictionary} />;
}
