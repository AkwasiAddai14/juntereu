import Footer from "@/app/[lang]/components/shared/navigation/Footer4";
import NavBar from "@/app/[lang]/components/shared/navigation/NavigationBar";
import { SignIn } from "@clerk/nextjs";
import { Locale } from '@/i18n.config';


const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
  'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
];

export default function Page({ params }: { params: { lang: string } }) {
  const lang = supportedLocales.includes(params.lang as Locale)
    ? (params.lang as Locale)
    : 'en';
  return (
    <>
      <NavBar lang={lang} />
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="flex items-center justify-center w-full">
          <SignIn path="/sign-in" />
        </div>
      </div>
      <Footer lang={lang} />
    </>
  );
}
