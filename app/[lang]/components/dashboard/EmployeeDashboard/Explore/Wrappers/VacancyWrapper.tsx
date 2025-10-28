'use client';

import { useEffect, useState } from 'react';
import { getDictionary } from '@/app/[lang]/dictionaries';
import VacancyClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Explore/Vacancy';
import type { Locale } from '@/app/[lang]/dictionaries';

type Props = {
  lang: Locale;
  dashboard?: any;
};

export default function VacancyPage({ lang, dashboard: propDashboard }: Props) {
  const [dashboard, setDashboard] = useState<any>(propDashboard);

  useEffect(() => {
    if (propDashboard) {
      setDashboard(propDashboard);
    } else {
      const fetchDictionary = async () => {
        if (lang) {
          const dict = await getDictionary(lang);
          setDashboard(dict.dashboard);
        }
      };
      fetchDictionary();
    }
  }, [lang, propDashboard]);

  if (!dashboard) {
    return <div>Loading...</div>;
  }

  return <VacancyClient lang={lang} dashboard={dashboard} />;
}
