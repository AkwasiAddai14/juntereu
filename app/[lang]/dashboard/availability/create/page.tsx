import { use } from "react";
import DashNav from "@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper";
import Footer from "@/app/[lang]/components/shared/navigation/Footer4";
import AvailabilityFormServer from "@/app/[lang]/components/shared/forms/Wrappers/AvailabilityWrapper";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

// Make this route request-bound so Clerk has context
export const dynamic = "force-dynamic";

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];


const MaakVacature = ({ params }: { params: Promise<{ lang: string }> }) => {
  const resolvedParams = use(params);
  const lang = supportedLocales.includes(resolvedParams.lang as Locale) ? (resolvedParams.lang as Locale): 'en';

  return (
    <>
    <DashNav lang={"en"} />
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper font-bold text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] text-center sm:text-left">Availability</h3>
      </section>
      <div className="w-full">
        <AvailabilityFormServer lang={lang} />
      </div>
    <Footer lang={lang} />
    </>
  )
}

export default MaakVacature;

