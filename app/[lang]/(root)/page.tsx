
import AuthRedirect from './AuthRedirect';
import { redirect } from 'next/navigation';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { Faqs }  from "@/app/[lang]/components/homepage/FAQs";
import Branches from "@/app/[lang]/components/homepage/Branches";
import BranchesSimple from "@/app/[lang]/components/homepage/BranchesSimple";
import Hero from "@/app/[lang]/components/homepage/HeroSection";
import { Features }  from "@/app/[lang]/components/homepage/Features";
import Footer from '@/app/[lang]/components/shared/navigation/HFooter';
import Testimonials from "@/app/[lang]/components/homepage/Testimonials";
import NavBar from '@/app/[lang]/components/shared/navigation/Wrappers/NavBarWrapper';
import { SimpleStaggerContainer } from '@/app/[lang]/components/shared/animations/AnimationUtils';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];


export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  
  const lang = supportedLocales.includes(resolvedParams.lang as Locale)
  ? (resolvedParams.lang as Locale)
  : 'en'
  
  if (!supportedLocales.includes(resolvedParams.lang as Locale)) {
    redirect(`/${lang}`);
  }
  
  return (
    <main>
      <AuthRedirect params={{lang: resolvedParams.lang}}/>
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


// ✅ REQUIRED als je [lang] route gebruikt
/* export async function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
} */


// fallback */
/* const rawLang = params.lang
const lang: Locale = supportedLocales.includes(rawLang as Locale)
  ? (rawLang as Locale)
  : 'en' // fallback */
