import { getDictionary } from '@/app/[lang]/dictionaries';
import DropdownPauzeClient from '@/app/[lang]/components/shared/DropdownPauze';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  value?: string;
  onChangeHandler?: (value: string) => void;
  lang: Locale;
};

export default async function DropdownPauzeWrapper({ value, onChangeHandler, lang }: Props) {
  const { components } = await getDictionary(lang);
  const options = components.shared.DropdownPauze.options;

  return (
    <DropdownPauzeClient
      value={value}
      onChangeHandler={onChangeHandler}
      options={options}
    />
  );
}
