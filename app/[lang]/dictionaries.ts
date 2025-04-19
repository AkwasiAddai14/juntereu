// import 'server-only'
 
const dictionaries = {
  en: () => import('@/app/dictionaries/en.json').then((module) => module.default),
  nl: () => import('@/app/dictionaries/nl.json').then((module) => module.default),
  fr: () => import('@/app/dictionaries/fr.json').then((module) => module.default),
  de: () => import('@/app/dictionaries/de.json').then((module) => module.default),
  es: () => import('@/app/dictionaries/es.json').then((module) => module.default),
  /* it: () => import('@/app/dictionaries/it.json').then((module) => module.default),
  pt: () => import('@/app/dictionaries/pt.json').then((module) => module.default),
  ar: () => import('@/app/dictionaries/ar.json').then((module) => module.default),
  fi: () => import('@/app/dictionaries/fi.json').then((module) => module.default),
  dk: () => import('@/app/dictionaries/dk.json').then((module) => module.default),
  no: () => import('@/app/dictionaries/no.json').then((module) => module.default),
  sw: () => import('@/app/dictionaries/sw.json').then((module) => module.default), */
}
 
export const getDictionary = async (locale: 'en' | 'nl' | 'fr' | 'de' | 'es' /* | 'it' | 'pt' | 'ar' | 'fi' | 'dk' | 'no' | 'sw' */) =>
  dictionaries[locale]()