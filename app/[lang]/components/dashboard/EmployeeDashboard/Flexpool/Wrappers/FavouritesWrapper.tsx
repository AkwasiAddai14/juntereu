import { getDictionary } from '@/app/[lang]/dictionaries';
import FavorietenClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Flexpool/Favourites';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function FavorietenServer({ lang }: { lang: Locale }) {
  const { dashboard } = await getDictionary(lang);

  return <FavorietenClient lang={lang} dashboard={dashboard} />;
}