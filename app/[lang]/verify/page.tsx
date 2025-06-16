'use client'

import { Locale } from '@/i18n.config'
import { getDictionary } from '@/app/[lang]/dictionaries'
import Example from './VerifyForm';


const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
  'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
];


export default async function VerifyPage({ params }: { params: { lang: Locale } }) {
  const { pages, navigation, footer } = await getDictionary(params.lang);

  return <Example pages={pages} navigation={navigation} footer={footer} params={{
    lang: ''
  }} />;
}