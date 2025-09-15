import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import DienstensectieClient from '@/app/[lang]/components/shared/Dienstensectie';
import { IJob } from '@/app/lib/models/job.model';

interface DienstenSectiePageProps {
  diensten: IJob[];
  lang: Locale;
}

export default async function DienstensectieServer({ diensten, lang }: DienstenSectiePageProps) {
  const dictionary = await getDictionary(lang);
  return <DienstensectieClient diensten={diensten} lang={lang} dictionary={dictionary} />;
}