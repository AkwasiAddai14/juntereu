'use client';

import { useEffect, useState } from 'react';
import { getDictionary } from '@/app/[lang]/dictionaries';
import ShiftsClient from '@/app/[lang]/components/dashboard/EmployeeDashboard/Explore/Shifts';
import type { Locale } from '@/app/[lang]/dictionaries';

type Props = {
  lang: Locale;
  dashboard?: any;
};

export default function ShiftsPage({ lang, dashboard: propDashboard }: Props) {
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

  return <ShiftsClient lang={lang} dashboard={dashboard} />;
}
