import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import CheckoutClient from '@/app/[lang]/components/shared/CheckoutModal';

interface CheckoutWrapperProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
  isVisible: boolean;
  onClose: () => void;
  lang: Locale;
}

export default async function CheckoutWrapper({ params, isVisible, onClose, lang }: CheckoutWrapperProps) {
  const { components } = await getDictionary(lang);
  return (
    <CheckoutClient
      shiftId={params.id}
      lang={lang}
      isVisible={isVisible}
      onClose={onClose}
      components={components}
    />
  );
}
