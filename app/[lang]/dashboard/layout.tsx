
import { ClerkProvider } from "@clerk/nextjs";
import { frFR, svSE, esES, ptPT, nbNO, itIT, deDE, fiFI, nlNL, daDK, arSA, enGB } from '@clerk/localizations'
import type { Metadata } from "next";
import '@/app/[lang]/globals.css';
import { Toaster } from "@/app/[lang]/components/ui/toaster"

export const metadata: Metadata = {
  title: "Junter",
  description: "Empowering progress , enabling growth",
  icons: {
    icon: "/Users/georgeaddai/Desktop/thejunter/thejunter/app/images/Color logo - no background.png",
  },
};

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

export default function DashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  if (!clerkPublishableKey) {
    throw new Error('Clerk: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined. Please check your environment variables or apphosting.yaml.');
  }

  return (
    <ClerkProvider 
      publishableKey={clerkPublishableKey}
    >
      {children}
      <Toaster />
    </ClerkProvider>
  );
};