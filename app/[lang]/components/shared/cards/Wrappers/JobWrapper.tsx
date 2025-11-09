import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { IJob } from '@/app/lib/models/job.model';
import JobCardClient from '@/app/[lang]/components/shared/cards/JobCard';

type Props = {
  dienst: IJob;
  lang: Locale;
  components?: any;
};

export default function JobCardServer({ dienst, lang, components }: Props) {
  // If components are not provided, use empty object (will fallback to defaults in client component)
  return <JobCardClient dienst={dienst} components={components || {}} />;
}