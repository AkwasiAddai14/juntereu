import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries';
import { IJob } from '@/app/lib/models/job.model';
import JobCardClient from '@/app/[lang]/components/shared/cards/JobCard';

type Props = {
  dienst: IJob;
  lang: Locale;
};

export default async function JobCardServer({ dienst, lang }: Props) {
  const { components } = await getDictionary(lang);

  return <JobCardClient dienst={dienst} components={components} />;
}