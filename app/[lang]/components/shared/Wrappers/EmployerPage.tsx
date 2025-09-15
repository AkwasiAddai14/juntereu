import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import BedrijvenPageClient from '@/app/[lang]/components/shared/EmployerPage';
import { IVacancy } from '@/app/lib/models/vacancy.model';
import { IJob } from '@/app/lib/models/job.model';
import  { IApplication }  from '@/app/lib/models/application.model';

interface Props {
  vacature: IVacancy;
  diensten: IJob[];
  sollicitaties: IApplication[];
  lang: Locale;
}

export default async function BedrijvenPageServer({ vacature, diensten, sollicitaties, lang }: Props) {
  const dictionary = await getDictionary(lang);
  return (
    <BedrijvenPageClient 
      vacature={vacature}
      diensten={diensten}
      sollicitaties={sollicitaties}
      lang={lang}
      dictionary={dictionary}
    />
  );
}