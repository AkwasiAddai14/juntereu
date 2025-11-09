import CheckoutCardClient from '@/app/[lang]/components/shared/cards/CheckoutCard';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { ShiftType } from '@/app/lib/models/shift.model';

export default function CheckoutCardServer({
  shift,
  lang,
  components,
}: {
  shift: ShiftType;
  lang: Locale;
  components?: any;
}) {
  // If components are not provided, use empty object (will fallback to defaults in client component)
  return <CheckoutCardClient shift={shift} components={components || {}} />;
}