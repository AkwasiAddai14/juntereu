// app/[lang]/(dashboard)/dashboard/components/Events.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import EventsClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/UpcomingEvents';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function Events({ lang }: { lang: Locale }) {
  const { dashboard } = await getDictionary(lang);

  return <EventsClient dashboard={dashboard} />;
}
