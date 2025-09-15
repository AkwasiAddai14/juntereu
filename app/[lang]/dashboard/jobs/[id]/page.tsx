import { getDictionary } from "@/app/[lang]/dictionaries";
import JobsClient from "@/app/[lang]/dashboard/jobs/[id]/client";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function JobsPage({
  params: { id, lang },
  searchParams,
}: {
  params: { id: string; lang: Locale };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { dashboard } = await getDictionary(lang);

  return (
    <JobsClient id={id} dashboard={dashboard} />
  );
}
