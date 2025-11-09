import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { IFlexpool } from '@/app/lib/models/flexpool.model';
import FlexpoolCard from '@/app/[lang]/components/shared/cards/FlexpoolCard';

type Props = {
  flexpool: IFlexpool;
  lang: Locale;
  components?: any;
};

export default function FlexpoolCardServer({ flexpool, lang, components }: Props) {
  // If components are not provided, use empty object (will fallback to defaults in client component)
  return <FlexpoolCard flexpool={flexpool} components={components || {}} />;
}