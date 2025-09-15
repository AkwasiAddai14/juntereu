export const i18n = {
    defaultLocale: 'en',
    locales: ['en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'no', 'sv', 'da', 'at', 'fr-CH', 'it-CH', 'lu', 'nl-BE', 'fr-BE', 'de-CH']
  } as const
  
  export type Locale = (typeof i18n)['locales'][number]