import { SignIn } from "@clerk/nextjs";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import Footer from "@/app/[lang]/components/shared/navigation/Footer4";
import NavBar from "@/app/[lang]/components/shared/navigation/Wrappers/NavigationBarWrapper";

// Make this route request-bound so Clerk has context
export const dynamic = "force-dynamic";

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default function Page({ params }: { params: { lang: string } }) {
  const lang = supportedLocales.includes(params.lang as Locale) ? (params.lang as Locale) : 'en';
  return (
    <>
      <NavBar lang={lang} />
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="flex items-center justify-center w-full">
          <SignIn path="/sign-in" />
        </div>
      </div>
      <Footer lang={lang} />
    </>
  );
}
