// app/[lang]/dashboard/shift/employee/[id]/page.tsx
import { getDictionary } from "@/app/[lang]/dictionaries";
import { haalShiftMetId, haalGerelateerdShiftsMetCategorie } from "@/app/lib/actions/shift.actions";
import { AuthorisatieCheck } from "@/app/[lang]/dashboard/AuthorisatieCheck";
import ShiftDetailsClient from "./client";
import type { Locale } from "@/app/[lang]/dictionaries";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const supportedLocales: Locale[] = [
  "en","nl","fr","de","es","it","pt","fi","da","no","lu","sv","at","nlBE","frBE","itCH","frCH","deCH",
];

interface PageProps {
  params: { lang: string; id: string };
  searchParams: Record<string, string | string[] | undefined>;
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

  // Must be a signed-in freelancer (case 1 in your switch)
  const toegang = await AuthorisatieCheck(id, 1);
  if (!toegang) return <h1>403 - Forbidden</h1>;

  const { dashboard } = await getDictionary(lang);

  const shift = await haalShiftMetId(id);
  const shiftId = (shift?._id ?? shift?.id)?.toString();

  const relatedEventsRaw = await haalGerelateerdShiftsMetCategorie({
    // Use the same property you render in the client (functie) — adjust if your schema differs
    categoryId: shift.function, 
    shiftId: shiftId!,
    page: (searchParams.page as string) || "1",
  });

  const relatedEvents = relatedEventsRaw
    ? {
        data: Array.isArray(relatedEventsRaw.data) ? relatedEventsRaw.data : [],
        totalPages: typeof relatedEventsRaw.totalPages === "number" ? relatedEventsRaw.totalPages : 0,
      }
    : { data: [], totalPages: 0 };

  return (
    <ShiftDetailsClient
      lang={lang}
      dashboard={dashboard}
      shift={shift}
      relatedEvents={relatedEvents}
    />
  );
}

