import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/app/[lang]/components/ui/toaster"
import '@/app/[lang]/globals.css'


const inter = Inter({ subsets: ["latin"] });

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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: 'en' | 'nl' | 'fr' | 'de' | 'es' | 'it' | 'pt' | 'fi' | 'dk' | 'no' | 'sw' | 'benl' | 'befr' | 'suit' | 'sufr' | 'sude' | 'lu' }>
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
    <html lang={(await params).lang}>
      <body className={inter.className}>
        {children}
        <Toaster />
        </body>
    </html>
    </ClerkProvider>
  );
}

