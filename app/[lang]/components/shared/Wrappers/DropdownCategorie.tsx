// DropdownCategorieWrapper.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import DropdownCategorieClient from '@/app/[lang]/components/shared/DropdownCategorie';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  value?: string;
  onChangeHandler?: (value: string) => void;
  lang: Locale;
};

export default async function DropdownCategorieWrapper({ value, onChangeHandler, lang }: Props) {
  const { components } = await getDictionary(lang);
  return (
    <DropdownCategorieClient
      value={value}
      onChangeHandler={onChangeHandler}
      components={components}
    />
  );
}