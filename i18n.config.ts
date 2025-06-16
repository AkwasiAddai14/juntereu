export const i18n = {
    defaultLocale: 'en',
    locales: ['en', 'de', 'nl', 'benl', 'befr', 'es', 'fr', 'it', 'pt', 'dk', 'os', 'sufr', 'suit', 'sude', 'lu', 'sw', 'fi', 'no']
  } as const
  
  export type Locale = (typeof i18n)['locales'][number]