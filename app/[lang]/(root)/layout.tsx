import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR, svSE, esES, ptPT, nbNO, itIT, deDE, fiFI, nlNL, daDK, arSA, enGB } from '@clerk/localizations'
import { Toaster } from "@/app/[lang]/components/ui/toaster"
import '@/app/[lang]/globals.css'

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
  
  // Directly get the value from process.env
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // IMPORTANT: Add a check here to ensure the key is present.
  // If this throws, it means the variable is NOT being passed during the build process.
  if (!clerkPublishableKey) {
    throw new Error('Clerk: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined. Please check your environment variables or apphosting.yaml.');
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

