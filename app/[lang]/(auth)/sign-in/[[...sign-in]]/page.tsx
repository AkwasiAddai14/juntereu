import { SignIn } from "@clerk/nextjs";
import type { Locale } from '@/app/[lang]/dictionaries';
import Footer from "@/app/[lang]/components/shared/navigation/Footer4";
import NavBar from "@/app/[lang]/components/shared/navigation/Wrappers/NavigationBarWrapper";

export const dynamic = "force-dynamic";

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = supportedLocales.includes(resolvedParams.lang as Locale) ? (resolvedParams.lang as Locale) : 'en';

  return (
    <>
      <NavBar lang={lang} />
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <div className="flex items-center justify-center w-full">
          <SignIn
            fallbackRedirectUrl={`/${lang}/dashboard`}
            forceRedirectUrl={`/${lang}/dashboard`}
          />
        </div>
      </div>
      <Footer lang={lang} />
    </>
  );
}
