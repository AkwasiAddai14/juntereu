
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/app/[lang]/globals.css';
import NavBar from "@/app/[lang]/components/shared/navigation/Wrappers/NavigationBarWrapper";
import Footer from "@/app/[lang]/components/shared/navigation/Footer";
import { Toaster } from "@/app/[lang]/components/ui/toaster";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Junter",
  description: "Empowering progress , enabling growth",
  icons: {
    icon: "/Users/georgeaddai/Desktop/thejunter/thejunter/app/images/Color logo - no background.png",
  },
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
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
    <html lang="en">
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
    <NavBar lang={lang} />
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
      <Footer lang={lang} />
      </html>        
    </ClerkProvider>
      )};