import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { IShiftArray } from '@/app/lib/models/shiftArray.model';
import ShiftArrayCardClient from '@/app/[lang]/components/shared/cards/ShiftArrayCard';

type Props = {
  shift: IShiftArray;
  lang: Locale;
  components?: any;
};

export default function ShiftArrayCardServer({ shift, lang, components }: Props) {
  // If components are not provided, use empty object (will fallback to defaults in client component)
  return <ShiftArrayCardClient shift={shift} components={components || {}} lang={lang} />;
}
