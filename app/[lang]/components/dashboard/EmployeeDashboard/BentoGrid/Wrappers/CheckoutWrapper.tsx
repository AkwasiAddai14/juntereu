// app/[lang]/dashboard/checkout/page.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import CheckoutClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/Checkout';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function Checkout({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);

  return <CheckoutClient dashboard={dictionary.dashboard} />;
}
