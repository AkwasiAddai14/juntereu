import { auth, currentUser } from "@clerk/nextjs/server";
import { getDictionary } from "@/app/[lang]/dictionaries";
import EmployeeFormClient from "@/app/[lang]/components/shared/forms/EmployeeForm";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function EmployeeFormServer({ lang }: { lang: Locale }) {
  const { userId } = await auth();
  const user = await currentUser();
  const dictionary = await getDictionary(lang);

  return (
    <EmployeeFormClient
      lang={lang}
      userId={userId ?? ""}
      user={user}
      components={dictionary.components}
    />
  );
}