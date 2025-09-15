import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import VacatureFormClient from '../VacancyForm';

export default async function VacatureFormWrapper({
  userId,
  type,
  vacature,
  vacatureId,
  lang
}: {
  userId: string;
  type: "maak" | "update";
  vacature?: any;
  vacatureId?: string;
  lang: Locale;
}) {
  const { components, Validations } = await getDictionary(lang);

  return (
    <VacatureFormClient
      userId={userId}
      type={type}
      vacature={vacature}
      vacatureId={vacatureId}
      components={components}
      validations={Validations}
    />
  );
}