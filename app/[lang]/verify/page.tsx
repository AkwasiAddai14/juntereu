'use client'

import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries'
import Example from './VerifyForm';


const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];


export default async function VerifyPage({ params }: { params: { lang: Locale } }) {
  const { pages, navigation, footer } = await getDictionary(params.lang);

  return <Example pages={pages} navigation={navigation} footer={footer} params={{
    lang: ''
  }} />;
}