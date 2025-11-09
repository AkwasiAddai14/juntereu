import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { clerkMiddleware } from '@clerk/nextjs/server'

import { Locale, i18n } from '@/i18n.config'

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string | undefined {
  try {
    const negotiatorHeaders: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      negotiatorHeaders[key] = value
    })
    
    // @ts-ignore locales are readonly
    const locales: string[] = i18n.locales
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
    
    // Filter out invalid locales and ensure we have valid data
    const validLanguages = languages.filter(lang => {
      try {
        return Intl.getCanonicalLocales(lang).length > 0
      } catch {
        return false
      }
    })
    
    if (validLanguages.length === 0) {
      console.log('No valid languages found, using default locale')
      return i18n.defaultLocale
    }
    
    const locale = matchLocale(validLanguages, locales, i18n.defaultLocale)
    console.log('Negotiator languages:', validLanguages)
    console.log('Matched locale:', locale)
    return locale
  } catch (error) {
    console.error('Error in getLocale:', error)
    return i18n.defaultLocale
  }
};

function isLocale(locale: string): locale is typeof i18n.locales[number] {
  return i18n.locales.includes(locale as any);
};

export default clerkMiddleware(async (auth, request: NextRequest) => {
  try {
    const pathname = request.nextUrl.pathname
    
    // Skip middleware for API routes - let them pass through without language prefix
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
    
    // Skip middleware for static files and Next.js internals
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/)
    ) {
      return NextResponse.next();
    }
    
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
  } catch (error) {
    // Log error but don't crash - allow request to proceed
    console.error('Middleware error:', error);
    // Fallback: try to continue with default locale
    try {
      const pathname = request.nextUrl.pathname;
      const locale = i18n.defaultLocale;
      if (!pathname.startsWith(`/${locale}`)) {
        return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
      }
      return NextResponse.next();
    } catch (fallbackError) {
      console.error('Fallback middleware error:', fallbackError);
      // Last resort: just pass through
      return NextResponse.next();
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
