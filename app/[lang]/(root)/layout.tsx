import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR, svSE, esES, ptPT, nbNO, itIT, deDE, fiFI, nlNL, daDK, arSA, enGB } from '@clerk/localizations'
import { Toaster } from "@/app/[lang]/components/ui/toaster"
import '@/app/[lang]/globals.css'

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Junter | Make Money Fast",
  description: "Ontdek een wereld van mogelijkheden op ons platform. Van creatieve projecten tot zakelijke taken, hier vind je jouw volgende succesverhaal. Word lid en maak je dromen werkelijkheid!",
  icons: {
    icon: "@/app/assets/images/iStock-2149706236.jpg",
  },
};

export async function generateStaticParams() {
  return [
      { lang: 'nl' }, 
      { lang: 'de' },
      { lang: 'en' },
      { lang: 'fr' },
      { lang: 'es' },
      { lang: 'it' },
      { lang: 'pt' },
      { lang: 'sw' },
      { lang: 'dk' },
      { lang: 'fi' },
      { lang: 'no' },
      { lang: 'lu' },
      { lang: 'benl' },
      { lang: 'befr' },
      { lang: 'suit' },
      { lang: 'sufr' },
      { lang: 'sude' },
  ]
}
const localeMap: Record<string, any> = {
  fr: frFR,
  sv: svSE,
  es: esES,
  pt: ptPT,
  nb: nbNO,
  it: itIT,
  de: deDE,
  fi: fiFI,
  nl: nlNL,
  da: daDK,
  ar: arSA,
  en: enGB
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: 'en' | 'nl' | 'fr' | 'de' | 'es' | 'it' | 'pt' | 'fi' | 'dk' | 'no' | 'sw' | 'benl' | 'befr' | 'suit' | 'sufr' | 'sude' | 'lu' }>
}>) {
  const resolvedParams = await params;
  const selectedLocalization = localeMap[resolvedParams.lang] || nlNL;
  
  const clerkPublishableKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    'pk_live_Y2xlcmsuanVudGVyLmV1JA';

  if (!clerkPublishableKey) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      localization={selectedLocalization}
    >
      {children}
      <Toaster />
    </ClerkProvider>
  );
}

