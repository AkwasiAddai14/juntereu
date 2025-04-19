export async function generateStaticParams() {
    return [
        { lang: 'nl' }, 
        { lang: 'de' },
        { lang: 'en' },
        { lang: 'fr' },
        { lang: 'es' },
        { lang: 'it' },
        { lang: 'pt' },
        { lang: 'ar' },
        { lang: 'sw' },
        { lang: 'dk' },
        { lang: 'fi' },
        { lang: 'no' }
    ]
  }
   
  export default async function RootLayout({
    children,
    params,
  }: Readonly<{
    children: React.ReactNode
    params: Promise<{ lang: 'en' | 'nl' | 'fr' | 'de' | 'es' | 'it' | 'pt' | 'ar' | 'fi' | 'dk' | 'no' | 'sw' }>
  }>) {
    return (
      <html lang={(await params).lang}>
        <body>{children}</body>
      </html>
    )
  }