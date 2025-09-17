/* // app/[lang]/dashboard/checkout/employees/[id]/page.tsx
import { getDictionary, type Locale } from "@/app/[lang]/dictionaries";
import CheckoutCardClient from "./client";
import { AuthorisatieCheck } from "@/app/[lang]/dashboard/AuthorisatieCheck";
import { haalShiftMetIdCard } from "@/app/lib/actions/shift.actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const supportedLocales = [
  "en","nl","fr","de","es","it","pt","fi","da","no","lu",
  "sv","at","nlBE","frBE","itCH","frCH","deCH",
] as const;

type Params = { lang: Locale; id: string };
type Search = { lang?: string };

export default async function Page({
  params,
  searchParams,
}: { params: Params; searchParams: Search }) {
  const hinted = (searchParams.lang as Locale) ?? params.lang;
  const lang = (supportedLocales as readonly string[]).includes(hinted) ? (hinted as Locale) : "en";

  // employee/freelancer-only (3 or adjust to your intended case)
  const toegang = await AuthorisatieCheck(params.id, 3);
  if (!toegang) return <h1>403 - Forbidden</h1>;

  const [dict, shiftData] = await Promise.all([
    getDictionary(lang),
    haalShiftMetIdCard(params.id),
  ]);

  return (
    <CheckoutCardClient
      id={params.id}
      lang={lang}
      dashboard={dict.dashboard}
      components={dict.components}
      initialShift={shiftData}
    />
  );
} */

  export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function Page() {
  return <div>OK</div>;
}

