import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/app/[lang]/globals.css';
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

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode 
} &
{ params: { lang: string }}) {
  const lang = supportedLocales.includes(params.lang as Locale) ? (params.lang as Locale) : 'en'; // fallback
  return (
   
    <html lang='en'>
      <head>
        {/* Google tag (gtag.js) */}
        
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17686346268"></script>
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-17686346268');
    `,
  }}
/>
      </head>
    <body className={inter.className}>
    {/* <NavBar lang={lang} /> */}
      <main>
        <section>
          <div>{children}</div>
        </section>
      </main>
      {/* <Footer lang={lang} /> */}
    </body>
  </html>
   
  );
}