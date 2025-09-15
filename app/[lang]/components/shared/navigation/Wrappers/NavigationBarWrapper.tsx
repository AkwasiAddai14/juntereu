// app/[lang]/components/shared/NavWrapper.tsx
import { getDictionary } from '@/app/[lang]/dictionaries';
import NavClient from '@/app/[lang]/components/shared/navigation/NavigationBar';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export default async function NavWrapper({ lang }: { lang: Locale }) {
    const { pages, navigation, components } = await getDictionary(lang);
  return <NavClient lang={lang} pages={pages} navigation={navigation} components={components} />;
}