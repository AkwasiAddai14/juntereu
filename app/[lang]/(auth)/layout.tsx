import { ClerkProvider } from '@clerk/nextjs'
import { frFR, svSE, esES, ptPT, nbNO, itIT, deDE, fiFI, nlNL, daDK, arSA, enGB } from '@clerk/localizations'
import '@/app/[lang]/globals.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Junter',
  description: 'Empowering progress, enabling growth.'
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


export default async function AuthLayout({
  children, params
} : 
{
  children : React.ReactNode
  params: Promise<{ lang: string }>;
}){

  const resolvedParams = await params;
  const selectedLocalization = localeMap[resolvedParams.lang] || nlNL;

  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkPublishableKey) {
    return (
      <div className="bg-dark-1 min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      localization={selectedLocalization}
    >
      <div className="bg-dark-1 min-h-screen">
        {children}
      </div>
    </ClerkProvider>
  );
};

//  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_live_Y2xlcmsuanVudGVyLmV1JA';