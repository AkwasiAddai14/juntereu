import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/app/[lang]/globals.css';
import NavBar from "@/app/[lang]/components/shared/navigation/Wrappers/NavigationBarWrapper";
import Footer from "@/app/[lang]/components/shared/navigation/Footer";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Junter",
  description: "Empowering progress , enabling growth",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode 
} &
{ params: Promise<{ lang: string }>}) {
  const resolvedParams = await params;
  const lang = supportedLocales.includes(resolvedParams.lang as Locale)
    ? (resolvedParams.lang as Locale)
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
};