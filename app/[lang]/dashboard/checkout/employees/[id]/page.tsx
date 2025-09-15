// Server Component (no 'use client')
import { getDictionary, type Locale } from '@/app/[lang]/dictionaries';
import { AuthorisatieCheck } from '@/app/[lang]/dashboard/AuthorisatieCheck';
import { haalShiftMetIdCard } from '@/app/lib/actions/shift.actions';
import CheckoutCardClient from './client';

const supportedLocales = [
  'en','nl','fr','de','es','it','pt','fi','da','no','lu',
  'sv','at','nlBE','frBE','itCH','frCH','deCH',
] as const satisfies readonly Locale[];

type Params = { lang: Locale; id: string };
type Search = { lang?: string };

export default async function Page({
  params,
  searchParams,
}: { params: Params; searchParams: Search }) {
  // pick lang from search or the segment, fall back to 'en'
  const hinted = (searchParams.lang as Locale) ?? params.lang;
  const lang = (supportedLocales as readonly string[]).includes(hinted) ? (hinted as Locale) : 'en';

  // server-only authorization & data loading
  const toegang = await AuthorisatieCheck(params.id, 3);
  if (!toegang) return <h1>403 - Forbidden</h1>;

  const [dictionary, shiftData] = await Promise.all([
    getDictionary(lang),
    haalShiftMetIdCard(params.id),
  ]);

  return (
    <CheckoutCardClient
      id={params.id}
      lang={lang} params={{
        id: ''
      }} searchParams={{}}    />
  );
}

// If anything in here relies on request context (auth/headers),
// keep this route dynamic to avoid being prerendered at build.
export const dynamic = 'force-dynamic';
