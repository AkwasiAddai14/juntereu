// DropdownWrapper.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import DropdownClient from '@/app/[lang]/components/shared/Dropdown';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  value?: string;
  onChangeHandler?: (value: string) => void;
  flexpoolsList: string[];
  userId: string;
  lang: Locale;
};

export default async function DropdownWrapper(props: Props) {
  const { lang, ...rest } = props;
  const { components } = await getDictionary(lang);

  return <DropdownClient {...rest} components={components} />;
}
