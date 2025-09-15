import { getDictionary } from '@/app/[lang]/dictionaries';
import CheckoutCardClient from '@/app/[lang]/components/shared/cards/CheckoutCard';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { ShiftType } from '@/app/lib/models/shift.model';

export default async function CheckoutCardServer({
  shift,
  lang,
}: {
  shift: ShiftType;
  lang: Locale;
}) {
  const { components } = await getDictionary(lang);

  return <CheckoutCardClient shift={shift} components={components} />;
}