import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { frFR, svSE, esES, ptPT, nbNO, itIT, deDE, fiFI, nlNL, daDK, arSA } from '@clerk/localizations'
import '@/app/[lang]/globals.css';

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
  ar: arSA
}

const inter = Inter({subsets: ["latin"]})

export default function AuthLayout({
  children, params
} : 
{
  children : React.ReactNode
  params: { lang: string };
}){

  const selectedLocalization = localeMap[params.lang] || nlNL;
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_live_Y2xlcmsuanVudGVyLmV1JA';
   // Directly get the value from process.env
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // IMPORTANT: Add a check here to ensure the key is present.
  // If this throws, it means the variable is NOT being passed during the build process.
  if (!clerkPublishableKey) {
    throw new Error('Clerk: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined. Please check your environment variables or apphosting.yaml.');
  }

  return(
    <ClerkProvider 
    publishableKey={clerkPublishableKey}
    localization={selectedLocalization}
    >
      <html lang="en">
       <body className={`${inter.className} bg-dark-1`}>
        {children}
       </body>
      </html>
    </ClerkProvider>
  )
}