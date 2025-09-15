// app/[lang]/dashboard/checkout/CheckoutCardServer.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import { AuthorisatieCheck } from '@/app/[lang]/dashboard/AuthorisatieCheck';
import { haalShiftMetIdCard } from '@/app/lib/actions/shift.actions';
import CheckoutCardClient from '@/app/[lang]/dashboard/checkout/employers/[id]/client';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CheckoutCardServer({ params, searchParams }: Props) {
  const id = params.id;
  const lang = supportedLocales.includes(searchParams.lang as Locale) ? (searchParams.lang as Locale): 'en'

  const toegang = await AuthorisatieCheck(id, 3);
  if (!toegang) return <h1>403 - Forbidden</h1>;

  const dictionary = await getDictionary(lang);
  const shiftData = await haalShiftMetIdCard(id);

  return (
    <CheckoutCardClient lang={lang} shiftData={shiftData} id={id} dictionary={dictionary} />
  );
}