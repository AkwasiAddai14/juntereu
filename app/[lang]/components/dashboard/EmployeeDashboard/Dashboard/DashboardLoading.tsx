import React from 'react';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';

const loading = async ({ lang }: { lang: Locale }) => {
  const { dashboard } = await getDictionary(lang);
  return (
    <main className="text-center">
      <h2 className='text-sky-500'>
      {dashboard.werknemersPage.Dashboard.DashboardingLoading.tekst1}
      </h2>
      <p>
      {dashboard.werknemersPage.Dashboard.DashboardingLoading.tekst2}
      </p>
    </main>
  )
}

export default loading