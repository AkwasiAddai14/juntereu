"use client";

import { useState } from 'react';
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

function Page({ params }: { params: { lang: string } }) {

  const [showDialog, setShowDialog] = useState(true);
  const [isFreelancer, setIsFreelancer] = useState(true);
  const lang = supportedLocales.includes(params.lang as Locale) ? (params.lang as Locale) : 'en';

  const handleFreelancerSelected = () => {
    setIsFreelancer(true);
    setShowDialog(false); // Close the dialog after user selection
  };

  const handleCompanySelected = () => {
    setIsFreelancer(false);
    setShowDialog(false); // Close the dialog after user selection
  };

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

