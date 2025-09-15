import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries';
import { IShiftArray } from '@/app/lib/models/shiftArray.model';
import ShiftArrayCardClient from '@/app/[lang]/components/shared/cards/ShiftArrayCard';

type Props = {
  shift: IShiftArray;
  lang: Locale;
};

export default async function ShiftArrayCardServer({ shift, lang }: Props) {
  const { components } = await getDictionary(lang);
  return <ShiftArrayCardClient shift={shift} components={components} lang={lang} />;
}
