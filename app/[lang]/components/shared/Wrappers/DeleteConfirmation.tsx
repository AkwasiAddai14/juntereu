import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { DeleteConfirmation } from '@/app/[lang]/components/shared/DeleteConfirmation';

export default async function DeleteConfirmationWrapper({
  shiftId,
  lang,
}: {
  shiftId: string;
  lang: Locale;
}) {
  const dictionary = await getDictionary(lang);

  return <DeleteConfirmation  shiftId={shiftId} lang={lang} dictionary={dictionary} />;
}
