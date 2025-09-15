import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { Iinvoice } from '@/app/lib/models/invoice.model';
import InvoiceCardClient from '@/app/[lang]/components/shared/cards/InvoiceCard';

type Props = {
  factuur: Iinvoice;
  lang: Locale;
};

export default async function InvoiceCardServer({ factuur, lang }: Props) {
  const { components } = await getDictionary(lang);

  return <InvoiceCardClient factuur={factuur} components={components} />;
}