import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import BedrijfsFormClient from '@/app/[lang]/components/shared/forms/CompanyForm';
import { auth, currentUser } from '@clerk/nextjs/server';

interface Props {
  lang: Locale;
}

const BedrijfsFormWrapper = async ({ lang }: Props) => {
  //const { userId } = await auth();
  const user = await currentUser();
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