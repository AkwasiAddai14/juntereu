// components/shared/SollicitatieModalWrapper.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import SollicitatieModal from '@/app/[lang]/components/shared/SollicitatieModal';

interface WrapperProps {
  sollicitatie: any;
  isVisible: boolean;
  lang: Locale;
}

export default async function SollicitatieModalWrapper({ sollicitatie, isVisible, lang }: WrapperProps) {
  const { components } = await getDictionary(lang);

  return (
    <SollicitatieModal
      sollicitatie={sollicitatie}
      isVisible={isVisible}
      lang={lang}
      components={components}
    />
  );
}
