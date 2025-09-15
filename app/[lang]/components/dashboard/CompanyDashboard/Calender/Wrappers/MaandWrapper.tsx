// app/[lang]/(root)/dashboard/components/CalenderM.server.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import CalenderMClient from '@/app/[lang]/components/dashboard/CompanyDashboard/Calender/Maand';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

interface Props {
  lang: Locale;
}

export default async function CalenderM({ lang }: Props) {
  const dictionary = await getDictionary(lang);
  return <CalenderMClient lang={lang} dashboard={dictionary.dashboard} />;
}
