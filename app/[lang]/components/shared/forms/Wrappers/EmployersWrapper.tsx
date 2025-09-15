'use client';

import { useUser } from '@clerk/nextjs';
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import BedrijfsFormClient from '@/app/[lang]/components/shared/forms/CompanyForm';

interface Props {
  lang: Locale;
}

const BedrijfsFormWrapper = async ({ lang }: Props) => {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null; // or a small skeleton
  const { components, Validations } = await getDictionary(lang);

  return (
    <BedrijfsFormClient
      lang={lang}
      userId={user!.id}
      components={components}
      validations={Validations}
    />
  );
};

export default BedrijfsFormWrapper;