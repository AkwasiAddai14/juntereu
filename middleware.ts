import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { Locale, i18n } from '@/i18n.config'

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

// Helper function to handle locale routing (used by both Clerk and non-Clerk middleware)
function handleLocaleRouting(request: NextRequest): NextResponse | null {
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
    
    return null; // Continue to next handler
  } catch (error) {
    console.error('Error in handleLocaleRouting:', error);
    return NextResponse.next(); // Fallback: just pass through
  }
}

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

// Try to use Clerk middleware, but fallback to simple middleware if it fails
let middlewareHandler: (request: NextRequest) => Promise<NextResponse> | NextResponse;

try {
  // Check if Clerk environment variables are available
  const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY;
  
  if (hasClerkKeys) {
    // Dynamically import clerkMiddleware only if keys are available
    const { clerkMiddleware } = require('@clerk/nextjs/server');
    
    middlewareHandler = clerkMiddleware(async (auth: any, request: NextRequest) => {
      const localeResponse = handleLocaleRouting(request);
      if (localeResponse) {
        return localeResponse;
      }
      return NextResponse.next();
    });
  } else {
    console.warn('Clerk keys not found, using fallback middleware');
    // Fallback: simple middleware without Clerk
    middlewareHandler = (request: NextRequest) => {
      const localeResponse = handleLocaleRouting(request);
      return localeResponse || NextResponse.next();
    };
  }
} catch (error) {
  console.error('Error initializing Clerk middleware, using fallback:', error);
  // Fallback: simple middleware without Clerk
  middlewareHandler = (request: NextRequest) => {
    const localeResponse = handleLocaleRouting(request);
    return localeResponse || NextResponse.next();
  };
}

export default middlewareHandler;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
