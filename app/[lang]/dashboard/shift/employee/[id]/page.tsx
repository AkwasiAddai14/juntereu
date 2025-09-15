// app/[lang]/dashboard/shiftDetails/page.tsx
import { getDictionary } from "@/app/[lang]/dictionaries";
import { haalShiftMetId, haalGerelateerdShiftsMetCategorie } from "@/app/lib/actions/shift.actions";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import ShiftDetailsClient from "@/app/[lang]/dashboard/shift/employee/[id]/client";
import { AuthorisatieCheck } from '@/app/[lang]/dashboard/AuthorisatieCheck';

export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
};

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default async function ShiftDetailsPage({ params: { id }, searchParams }: SearchParamProps) {
  const lang = supportedLocales.includes(searchParams.lang as Locale) ? searchParams.lang as Locale : 'en';
  const { dashboard } = await getDictionary(lang);
  
  const shift = await haalShiftMetId(id);
  const isGeAuthorizeerd = async (id:string) => {
    const toegang = await AuthorisatieCheck(id, 1);
    if(!toegang){
      return <h1>403 - Forbidden</h1>
    }
  }
  
  isGeAuthorizeerd(id);
  const relatedEvents = await haalGerelateerdShiftsMetCategorie({
    categoryId: shift.function,
    shiftId: shift.id,
    page: searchParams.page as string || "1",
  });

  return (
    <ShiftDetailsClient
      lang={lang}
      dashboard={dashboard}
      shift={shift}
      relatedEvents={relatedEvents}
    />
  );
}
