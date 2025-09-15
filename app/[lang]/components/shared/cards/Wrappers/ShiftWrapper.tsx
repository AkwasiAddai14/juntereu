import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries';
import { ShiftType } from '@/app/lib/models/shift.model';
import ShiftCardClient from '@/app/[lang]/components/shared/cards/ShiftCard';

type Props = {
  shift: ShiftType;
  lang: Locale;
};

export default async function ShiftCardServer({ shift, lang }: Props) {
  const { components } = await getDictionary(lang);
  return <ShiftCardClient shift={shift} lang={lang} components={components} />;
}