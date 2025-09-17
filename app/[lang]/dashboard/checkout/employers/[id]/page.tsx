// app/[lang]/dashboard/checkout/employers/[id]/page.tsx
import CheckoutCardClient from '@/app/[lang]/dashboard/checkout/employers/[id]/client';
import { getDictionary } from "@/app/[lang]/dictionaries";
import { AuthorisatieCheck } from "@/app/[lang]/dashboard/AuthorisatieCheck";
import { haalShiftMetIdCard } from "@/app/lib/actions/shift.actions";
import type { Locale } from "@/app/[lang]/dictionaries";

// Make this route request-bound so Clerk/headers() have context
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const supportedLocales: Locale[] = [
  "en","nl","fr","de","es","it","pt","fi","da","no","lu","sv","at","nlBE","frBE","itCH","frCH","deCH",
];

interface PageProps {
  params: { lang: string; id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = params;

  const rawLang =
    (searchParams.lang as string | undefined) ??
    (params.lang as Locale | undefined) ??
    "en";

  const lang: Locale = supportedLocales.includes(rawLang as Locale)
    ? (rawLang as Locale)
    : "en";

  const dict = await getDictionary(lang);
  const shiftData = await haalShiftMetIdCard(id);

  return (
    <CheckoutCardClient
      id={id}
      lang={lang}
      dashboard={dict.dashboard}
      components={dict.components}
      shiftData={shiftData}
    />
  );
}
