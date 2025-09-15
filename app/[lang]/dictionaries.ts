// import 'server-only'
 
const dictionaries = {
  en: () => import('@/app/dictionaries/en.json').then((module) => module.default),
  nl: () => import('@/app/dictionaries/nl.json').then((module) => module.default),
  fr: () => import('@/app/dictionaries/fr.json').then((module) => module.default),
  de: () => import('@/app/dictionaries/de.json').then((module) => module.default),
  es: () => import('@/app/dictionaries/es.json').then((module) => module.default),
  it: () => import('@/app/dictionaries/it.json').then((module) => module.default),
  pt: () => import('@/app/dictionaries/pt.json').then((module) => module.default),
  fi: () => import('@/app/dictionaries/fi.json').then((module) => module.default),
  da: () => import('@/app/dictionaries/dk.json').then((module) => module.default),
  no: () => import('@/app/dictionaries/no.json').then((module) => module.default),
  lu: () => import('@/app/dictionaries/lu.json').then((module) => module.default),
  sv: () => import('@/app/dictionaries/sw.json').then((module) => module.default),
  at: () => import('@/app/dictionaries/os.json').then((module) => module.default),
  nlBE: () => import('@/app/dictionaries/benl.json').then((module) => module.default),
  frBE: () => import('@/app/dictionaries/befr.json').then((module) => module.default),
  itCH: () => import('@/app/dictionaries/suit.json').then((module) => module.default),
  frCH: () => import('@/app/dictionaries/sufr.json').then((module) => module.default),
  deCH: () => import('@/app/dictionaries/sude.json').then((module) => module.default), 
}

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
  const loadDictionary = dictionaries[locale];
  if (!loadDictionary) {
    throw new Error(`No dictionary found for locale: ${locale}`);
  }
  return loadDictionary();
};
 
// export const getDictionary = async (locale: 'en' | 'nl' | 'fr' | 'de' | 'es' | 'it' | 'pt' | 'fi' | 'dk' | 'no' | 'sw' | 'os' | 'lu' | 'benl'| 'befr' | 'suit' | 'sufr' | 'sude' ) =>
//   dictionaries[locale]()