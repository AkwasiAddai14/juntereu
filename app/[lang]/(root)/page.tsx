import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import NavBar from '@/app/[lang]/components/shared/navigation/NavBar';
import  Hero  from "@/app/[lang]/components/homepage/HeroSection";
import { Features }  from "@/app/[lang]/components/homepage/Features";
import Branches from "@/app/[lang]/components/homepage/Branches";
import Testimonials from "@/app/[lang]/components/homepage/Testimonials";
import { Faqs }  from "@/app/[lang]/components/homepage/FAQs";
import Footer from '@/app/[lang]/components/shared/navigation/HFooter';
import AuthRedirect from './AuthRedirect';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
  'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
];

// ✅ REQUIRED als je [lang] route gebruikt
export async function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

export default async function Home({ params }: { params: { lang: string } }) {
  /* const lang = supportedLocales.includes(params.lang as Locale)
    ? (params.lang as Locale)
    : 'en'; // fallback */
    const rawLang = params.lang
    const lang: Locale = supportedLocales.includes(rawLang as Locale)
      ? (rawLang as Locale)
      : 'en' // fallback

  return (
    <main>
      <AuthRedirect />
      <NavBar lang={lang}/>
      <Hero lang={lang}/> 
      <Features lang={lang}/>
      <Branches lang={lang}/>
       <Testimonials lang={lang}/> 
      <Faqs lang={lang}/>
      <Footer lang={lang}/>
    </main>
  );
};