// app/[lang]/components/cards/CardWrapper.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import Card from '@/app/[lang]/components/shared/cards/ApplicationCard';
import { IApplication } from '@/app/lib/models/application.model';

export default async function CardWrapper({ sollicitatie, lang }: { sollicitatie: IApplication; lang: Locale }) {
  const dictionary = await getDictionary(lang);
  return <Card sollicitatie={sollicitatie} lang={lang} components={dictionary.components} />;
}