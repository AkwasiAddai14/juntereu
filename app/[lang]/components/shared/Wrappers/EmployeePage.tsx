import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import WerknemerPageClient from '@/app/[lang]/components/shared/EmployeePage';

interface WerknemerPageProps {
  vacature: any;
  diensten: any[];
  lang: Locale;
}

export default async function WerknemerPageServer({ vacature, diensten, lang }: WerknemerPageProps) {
  const dictionary = await getDictionary(lang);

  return (
    <WerknemerPageClient
      vacature={vacature}
      diensten={diensten}
      lang={lang}
      dictionary={dictionary}
    />
  );
}
