import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Junter - Find Your Next Assignment',
  description: 'Discover a world of opportunities as an employee on our platform. From creative projects to business tasks, find your next success story here.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17686346268"></script>
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-17686346268');
    `,
  }}
/>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
