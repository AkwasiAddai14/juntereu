"use client";

import { useState, useEffect } from 'react';
import { use } from 'react';
import NavBar from "@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper";
import FreelancerForm from "@/app/[lang]/components/shared/forms/Wrappers/EmployeeWrapper";
import BedrijfsForm from '@/app/[lang]/components/shared/forms/Wrappers/EmployersWrapper';
import Footer from "@/app/[lang]/components/shared/navigation/Footer4";
import OnboardingDialog from "@/app/[lang]/components/shared/Onboarding";
import { useRouter } from 'next/navigation';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

// Make this route request-bound so Clerk has context
export const dynamic = "force-dynamic";

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

function Page({ params }: { params: Promise<{ lang: string }> }) {
  const [showDialog, setShowDialog] = useState(true);
  const [isFreelancer, setIsFreelancer] = useState(true);
  const [lang, setLang] = useState<Locale>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        const resolvedLang = supportedLocales.includes(resolvedParams.lang as Locale) 
          ? (resolvedParams.lang as Locale) 
          : 'en';
        setLang(resolvedLang);
        setLoading(false);
      } catch (error) {
        console.error('Error resolving params:', error);
        setLoading(false);
      }
    };
    
    resolveParams();
  }, [params]);

  const handleFreelancerSelected = () => {
    setIsFreelancer(true);
    setShowDialog(false); // Close the dialog after user selection
  };

  const handleCompanySelected = () => {
    setIsFreelancer(false);
    setShowDialog(false); // Close the dialog after user selection
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar lang={lang} />
      <main className="flex-grow">
        {showDialog && (
          <OnboardingDialog
            onFreelancerSelected={handleFreelancerSelected}
            onCompanySelected={handleCompanySelected}
            lang={lang}
          />
        )}

        {!showDialog && (
          isFreelancer ? (
            <FreelancerForm lang={lang} />
          ) : (
          
            <BedrijfsForm lang={lang}  />
          )
        )}
      </main>
      <Footer lang={lang}/>
    </>
  );
}
  {/* <RedirectToCreateOrganization/> */}
export default Page;

