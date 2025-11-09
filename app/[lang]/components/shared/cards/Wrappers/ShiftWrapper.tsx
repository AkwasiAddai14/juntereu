import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { ShiftType } from '@/app/lib/models/shift.model';
import ShiftCardClient from '@/app/[lang]/components/shared/cards/ShiftCard';

type Props = {
  shift: ShiftType;
  lang: Locale;
  components?: any;
};

export default function ShiftCardServer({ shift, lang, components }: Props) {
  // If components are not provided, use empty object (will fallback to defaults in client component)
  return <ShiftCardClient shift={shift} lang={lang} components={components || {}} />;
}