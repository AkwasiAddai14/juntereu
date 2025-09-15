// app/[lang]/components/dashboard/CompanyDashboard/Calender/CalenderWServer.tsx

import { getDictionary } from '@/app/[lang]/dictionaries'
import CalenderWClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Calender/Week'
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


interface Props {
  lang: Locale
}

export default async function CalenderWServer({ lang }: Props) {
  const { dashboard } = await getDictionary(lang)

  return <CalenderWClient dashboard={dashboard} />
}
