import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";


import '@/app/[lang]/globals.css';
import NavBar from "@/app/[lang]/components/shared/navigation/NavigationBar";
import Footer from "@/app/[lang]/components/shared/navigation/Footer";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
  'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
];


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Junter",
  description: "Making Money Fast",
};

export default function RootLayout({
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
   
      <html lang='en'>
        <body className={inter.className}>
          <NavBar lang={lang} />
          <main className="flex flex-row justify-center items-center min-h-screen">


            <section className="main-container flex justify-center items-center">
              <div className='w-full max-w-4xl'>{children}</div>
            </section>
            {/* @ts-ignore */}

          </main>
          <Footer lang={lang} />
        </body>
      </html>
   
  );
}