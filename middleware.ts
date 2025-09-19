import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { clerkMiddleware } from '@clerk/nextjs/server'

import { Locale, i18n } from '@/i18n.config'

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value
  })
  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  const locale = matchLocale(languages, locales, i18n.defaultLocale)
  console.log('Negotiator languages:', languages)
  console.log('Matched locale:', locale)
  return locale
};

function isLocale(locale: string): locale is typeof i18n.locales[number] {
  return i18n.locales.includes(locale as any);
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  //const { pathname } = request.nextUrl;
  const pathnameLocale = pathname.split('/')[1]; // haalt 'en' uit '/en/nlBE'
  const isValidLocale = i18n.locales.includes(pathnameLocale as Locale);
  
  // als geen geldige locale aanwezig is vóór de rest van het pad
  if (!isValidLocale) {
    const locale = getLocale(request) || i18n.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
  
  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request) || i18n.defaultLocale
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  } 
  
  /* return NextResponse.next() */
  
  
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  // ✅ Redirect / → /<locale>
  if (!isLocale(firstSegment)) {
    const locale = getLocale(request) || i18n.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
  
  // ✅ Redirect /en/nl-BE → /nl-BE
  if (segments.length > 1 && isLocale(segments[1])) {
    return NextResponse.redirect(new URL(`/${segments[1]}`, request.url));
  }
  
  return NextResponse.next();
};

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
