import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries';
import { IVacancy } from '@/app/lib/models/vacancy.model';
import VacancyCardClient from '@/app/[lang]/components/shared/cards/VacancyCard';

type Props = {
  vacature: IVacancy;
  lang: Locale;
};

export default async function VacancyCardServer({ vacature, lang }: Props) {
  const { components } = await getDictionary(lang);
  return <VacancyCardClient vacature={vacature} lang={lang} components={components} />;
}