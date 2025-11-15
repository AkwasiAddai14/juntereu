import React from "react";
import NavBar from "@/app/[lang]/components/shared/navigation/Wrappers/NavigationBarWrapper";
import Footer from "@/app/[lang]/components/shared/navigation/Footer";
import type { Locale } from '@/app/[lang]/dictionaries';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

export default function TemporaryLayout({
  children,
  params
}: {
  children: React.ReactNode 
} &
{ params: { lang: string }}) {
  const lang = supportedLocales.includes(params.lang as Locale)
    ? (params.lang as Locale)
    : 'en'; // fallback
  return (
    <>
      <NavBar lang={lang} />
      <main>
        <section>
          <div>{children}</div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}