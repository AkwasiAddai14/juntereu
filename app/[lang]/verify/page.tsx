'use client'

import { Locale } from '@/i18n.config'
import { getDictionary } from '@/app/[lang]/dictionaries'
import Example from './VerifyForm';


export default async function VerifyPage({ params }: { params: { lang: Locale } }) {
  const { pages, navigation, footer } = await getDictionary(params.lang);

  return <Example pages={pages} navigation={navigation} footer={footer} />;
}