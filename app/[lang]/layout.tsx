import '@/app/[lang]/globals.css'
import { ClerkAvailableProvider } from '@/app/[lang]/(root)/ClerkAvailableContext'

export async function generateStaticParams() {
    return [
        { lang: 'en' },
        { lang: 'nl' }, 
        { lang: 'fr' },
        { lang: 'de' },
        { lang: 'frCH' },
        { lang: 'os' },
        { lang: 'es' },
        { lang: 'it' },
        { lang: 'pt' },
        { lang: 'sw' },
        { lang: 'dk' },
        { lang: 'fi' },
        { lang: 'no' },
        { lang: 'lu' },
        { lang: 'nlBE' },
        { lang: 'frBE' },
        { lang: 'itCH' },
        { lang: 'deCH' },
    ]
  }
   
  export default async function LangLayout({
    children,
    params,
  }: Readonly<{
    children: React.ReactNode
    params: Promise<{ lang: 'en' | 'nl' | 'fr' | 'de' | 'es' | 'it' | 'pt' | 'fi' | 'os' | 'dk' | 'no' | 'sw' | 'nlBE' | 'frBE' | 'itCH' | 'frCH' | 'deCH' | 'lu' }>
  }>) {
    const clerkAvailable = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    return (
      <ClerkAvailableProvider available={clerkAvailable}>
        {children}
      </ClerkAvailableProvider>
    )
  }