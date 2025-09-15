import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { ApplyConfirmation } from '@/app/[lang]/components/shared/ApplyConfirmation';

export default async function ApplyConfirmationWrapper({
  shiftId,
  lang,
}: {
  shiftId: string;
  lang: Locale;
}) {
  const dictionary = await getDictionary(lang);
  return <ApplyConfirmation shiftId={shiftId} lang={lang} dictionary={dictionary} />;
}
