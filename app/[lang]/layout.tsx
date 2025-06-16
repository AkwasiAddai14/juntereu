import '@/app/[lang]/globals.css'

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
    children: React.ReactNode
    params: Promise<{ lang: 'en' | 'nl' | 'fr' | 'de' | 'es' | 'it' | 'pt' | 'fi' | 'dk' | 'no' | 'sw' | 'benl' | 'befr' | 'suit' | 'sufr' | 'sude' | 'lu' }>
  }>) {
    return (
      <html lang={(await params).lang}>
        <body>{children}</body>
      </html>
    )
  }