// components/SollicitatiesWrapper.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import { Sollicitaties } from '@/app/[lang]/components/shared/Sollicitaties'; // nieuwe naam voor de client component
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

export default async function SollicitatiesWrapper({
  sollicitaties,
  lang,
}: {
  sollicitaties: any;
  lang: Locale;
}) {
  const { components } = await getDictionary(lang);

  return <Sollicitaties sollicitaties={sollicitaties} lang={lang} components={components} />;
}