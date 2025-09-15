import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import BedrijfsFormClient from '@/app/[lang]/components/shared/forms/CompanyForm';
import { auth } from '@clerk/nextjs/server';

interface Props {
  lang: Locale;
}

const BedrijfsFormWrapper = async ({ lang }: Props) => {
  const { userId } = await auth();
  const { components, Validations } = await getDictionary(lang);

  return (
    <BedrijfsFormClient
      lang={lang}
      userId={userId}
      components={components}
      validations={Validations}
    />
  );
};

export default BedrijfsFormWrapper;