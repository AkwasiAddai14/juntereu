// app/[lang]/(dashboard)/profile/ProfilePage.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import ProfileClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/BentoGrid/Profile';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function ProfilePage({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);

  return <ProfileClient dashboard={dict.dashboard} />;
}
