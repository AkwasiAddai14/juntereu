import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { IFlexpool } from '@/app/lib/models/flexpool.model';
import FlexpoolCard from '@/app/[lang]/components/shared/cards/FlexpoolCard';

type Props = {
  flexpool: IFlexpool;
  lang: Locale;
};

export default async function FlexpoolCardServer({ flexpool, lang }: Props) {
  const { components } = await getDictionary(lang);

  return <FlexpoolCard flexpool={flexpool} components={components} />;
}