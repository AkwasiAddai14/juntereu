import { SignUp } from "@clerk/nextjs";
import Footer from "@/app/[lang]/components/shared/navigation/Footer4";
import NavBar from "@/app/[lang]/components/shared/navigation/Wrappers/NavigationBarWrapper";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys



const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default function Page({ params }: { params: { lang: string } }) {
  const lang = supportedLocales.includes(params.lang as Locale)
    ? (params.lang as Locale)
    : 'en';
  return (
    <>
    <NavBar lang={lang} />
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="flex items-center justify-center w-full">
        <SignUp path="/sign-up"/>
      </div>
    </div>
    <Footer lang={lang}/>
    </>
)
}