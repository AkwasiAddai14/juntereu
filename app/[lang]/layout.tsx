import '@/app/[lang]/globals.css'

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
   
  export default async function RootLayout({
    children,
    params,
  }: Readonly<{
    children: React.ReactNode
    params: Promise<{ lang: 'en' | 'nl' | 'fr' | 'de' | 'es' | 'it' | 'pt' | 'fi' | 'os' | 'dk' | 'no' | 'sw' | 'nlBE' | 'frBE' | 'itCH' | 'frCH' | 'deCH' | 'lu' }>
  }>) {
    return (
      <html lang={(await params).lang}>
        <body>{children}</body>
      </html>
    )
  }