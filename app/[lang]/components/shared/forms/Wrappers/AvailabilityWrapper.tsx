// app/[lang]/components/forms/AvailabilityFormServer.tsx
import AvailabilityFormClient from '@/app/[lang]/components/shared/forms/AvailabilityForm';
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


type Props = {
  lang: Locale;
};

export default async function AvailabilityFormServer({ lang }: Props) {
  const { components } = await getDictionary(lang);

  return <AvailabilityFormClient components={components} />;
}