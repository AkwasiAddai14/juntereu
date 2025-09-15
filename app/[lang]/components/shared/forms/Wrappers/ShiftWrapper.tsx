import { getDictionary } from "@/app/[lang]/dictionaries";
import ShiftForm from "@/app/[lang]/components/shared/forms/ShiftForm";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { IShiftArray } from "@/app/lib/models/shiftArray.model";

type ShiftFormProps = {
    userId: string;
    type: "maak" | "update";
    shift?: IShiftArray;
    shiftId?: string;
  };

export default async function ShiftFormWrapper({ lang, ...props }: { lang: Locale } & ShiftFormProps) {
  const dict = await getDictionary(lang);
  return <ShiftForm {...props} components={dict.components} />;
}