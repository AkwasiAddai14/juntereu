// app/[lang]/components/shared/NavWrapper.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import NavClient from '@/app/[lang]/components/shared/navigation/NavigationBar';

export default async function NavWrapper({ lang }: { lang: Locale }) {
    const { components ,pages, navigation } = await getDictionary(lang);

  return <NavClient lang={lang} components={components} pages={pages} navigation={navigation} />;
}