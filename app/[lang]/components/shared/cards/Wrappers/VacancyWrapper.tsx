import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { IVacancy } from '@/app/lib/models/vacancy.model';
import VacancyCardClient from '@/app/[lang]/components/shared/cards/VacancyCard';

type Props = {
  vacature: IVacancy;
  lang: Locale;
  components?: any;
};

export default function VacancyCardServer({ vacature, lang, components }: Props) {
  // If components are not provided, use empty object (will fallback to defaults in client component)
  return <VacancyCardClient vacature={vacature} lang={lang} components={components || {}} />;
}