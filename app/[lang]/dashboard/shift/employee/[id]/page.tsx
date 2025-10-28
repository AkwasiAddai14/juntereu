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
  params: Promise<{ lang: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id, lang: paramLang } = await params;
  const resolvedSearchParams = await searchParams;

  const rawLang =
    (resolvedSearchParams.lang as string | undefined) ??
    (paramLang as Locale | undefined) ??
    "en";
  const lang: Locale = supportedLocales.includes(rawLang as Locale)
    ? (rawLang as Locale)
    : "en";

  const { dashboard } = await getDictionary(lang);

  const shift = await haalShiftMetId(id);
  const shiftId = (shift?._id ?? shift?.id)?.toString();

  const relatedEventsRaw = await haalGerelateerdShiftsMetCategorie({
    // Use the same property you render in the client (functie) — adjust if your schema differs
    categoryId: shift.function, 
    shiftId: shiftId!,
    page: (resolvedSearchParams.page as string) || "1",
  });

  const relatedEvents = relatedEventsRaw
    ? {
        data: Array.isArray(relatedEventsRaw.data) ? relatedEventsRaw.data : [],
        totalPages: typeof relatedEventsRaw.totalPages === "number" ? relatedEventsRaw.totalPages : 0,
      }
    : { data: [], totalPages: 0 };

  // Properly serialize the shift data to avoid serialization errors
  const serializedShift = shift ? JSON.parse(JSON.stringify(shift)) : null;
  const serializedRelatedEvents = {
    data: relatedEvents.data.map(item => JSON.parse(JSON.stringify(item))),
    totalPages: relatedEvents.totalPages
  };

  return (
    <ShiftDetailsClient
      lang={lang}
      dashboard={dashboard}
      shift={serializedShift}
      relatedEvents={serializedRelatedEvents}
    />
  );
}

