'use client';

import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeDashboard from '@/app/[lang]/components/dashboard/EmployeeDashboard/Dashboard/dashboard';
import EmployerDashboard from '@/app/[lang]/components/dashboard/CompanyDashboard/Dashboard/dashboard';

interface DashboardPageProps {
  params: Promise<{ lang: Locale }>;
}

const supportedLocales: Locale[] = [
     'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
     'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
   ];

export default function DashboardPage({ params }: DashboardPageProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [lang, setLang] = useState<Locale>('en');
  const [dictionary, setDictionary] = useState<any>(null);
  const [isInOrganization, setIsInOrganization] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        const resolvedLang = supportedLocales.includes(resolvedParams.lang as Locale) 
          ? (resolvedParams.lang as Locale) 
          : 'en';
        setLang(resolvedLang);
        
        const dict = await getDictionary(resolvedLang);
        setDictionary(dict);
      } catch (error) {
        console.error('Error resolving params:', error);
        setLang('en');
        const dict = await getDictionary('en');
        setDictionary(dict);
      }
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      router.push(`/${lang}/sign-in`);
      return;
    }

    // Check organization membership
    const checkOrganization = async () => {
      try {
        console.log('Checking organization membership for user:', user?.id);
        
        // First try client-side check as fallback
        if ((user as any)?.organizationMemberships && (user as any).organizationMemberships.length > 0) {
          console.log('Client: Found organization memberships via user property:', (user as any).organizationMemberships.length);
          setIsInOrganization(true);
          setIsLoading(false);
          return;
        }
        
        const response = await fetch('/api/check-organization');
        
        if (!response.ok) {
          console.error('Organization API failed:', response.status, response.statusText);
          setIsInOrganization(false);
          return;
        }
        
        const data = await response.json();
        console.log('Organization API response:', data);
        setIsInOrganization(data.isInOrganization);
        console.log('User organization status:', data.isInOrganization);
      } catch (error) {
        console.error('Error checking organization:', error);
        setIsInOrganization(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOrganization();
  }, [isLoaded, isSignedIn, user, router, lang]);

  if (!isLoaded || isLoading || !dictionary) {
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
    <div>
      {isInOrganization ? (
        <EmployerDashboard lang={lang} dashboard={dictionary.dashboard} />
      ) : (
        <EmployeeDashboard lang={lang} dashboard={dictionary.dashboard} />
      )}
    </div>
  );
};

// import { useUser } from '@clerk/nextjs';
// import dynamicImport from 'next/dynamic';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { use } from 'react';
// import { checkOnboardingStatusEmployer } from '@/app/lib/actions/employer.actions';
// import { checkOnboardingStatusEmployee } from '@/app/lib/actions/employee.actions';
// import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

// // Make this route request-bound so Clerk has context
// export const dynamic = "force-dynamic";

// const supportedLocales: Locale[] = [
//   'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
//   'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
// ];
// const EmployeeDashboard = dynamicImport(() => import('@/app/[lang]/components/dashboard/EmployeeDashboard/Dashboard/DashboardWrapper'));
// const EmployerDashboard = dynamicImport(() => import('@/app/[lang]/components/dashboard/CompanyDashboard/Dashboard/DashboardWrapper'));

// /* const supportedLocales: Locale[] = [
//   'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
//   'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
// ]; */

// const DashboardPage = ({ params }: { params: Promise<{ lang: string }> }) => {
//   const resolvedParams = use(params);
//   const lang = supportedLocales.includes(resolvedParams.lang as Locale) ? (resolvedParams.lang as Locale): 'en';
//   const { isLoaded, isSignedIn, user } = useUser();
//   const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
//   const [isBedrijf, setIsBedrijf] = useState<boolean | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoaded) return;
//     if (!isSignedIn) {
//       router.push('/sign-in');
//       return;
//     }
//     setIsBedrijf(user?.organizationMemberships?.length > 0);
//   }, [isLoaded, isSignedIn, user, router]);

//   useEffect(() => {
//     const fetchOnboardingStatus = async () => {
//       if (isBedrijf === null) return;
//       try {
//         const userId = user?.id;
//         if (!userId) throw new Error('User ID missing');

//         const response = isBedrijf
//           ? await checkOnboardingStatusEmployer(userId)
//           : await checkOnboardingStatusEmployee(userId);
//         setIsOnboarded(response);
//         setIsLoading(false)
//       } catch (error) {
//         console.error('Error:', error);
//         router.push('/sign-in');
//       }
//     };
//     fetchOnboardingStatus();
//   }, [isBedrijf, user, router]);

//   // Redirect based on state
//   useEffect(() => {
//     if (!isLoaded) return;
//     if (!isSignedIn) {
//       router.push('/sign-in');
//     } else if (isOnboarded === false) {
//       router.push('/verifieren');
//     }
//   }, [isLoaded, isSignedIn, isOnboarded, router]);

//   if (!isLoaded || isLoading) {
//      return (
//       <div className="bg-white min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {isBedrijf ? <EmployerDashboard lang={lang} /> : <EmployeeDashboard lang={lang} /> }
//     </div>
//   );
// };

// export default DashboardPage;






//import { useRouter } from 'next/navigation';
//import { useEffect, useState } from 'react';
//import { checkOnboardingStatusEmployee } from '@/app/lib/actions/employee.actions';
//import { checkOnboardingStatusEmployer } from '@/app/lib/actions/employer.actions';
//import EmployerDashboard from '@/app/[lang]/components/dashboard/CompanyDashboard/Dashboard/dashboard';


// Make this route request-bound so Clerk has context

  // const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  // const [isBedrijf, setIsBedrijf] = useState<boolean | null>(null);
  // const [isLoading, setIsLoading] = useState(true);
  //const router = useRouter();

  //   useEffect(() => {
  //   if (!isLoaded) return;
  //   if (!isSignedIn) {
  //     router.push('/sign-in');
  //     return;
  //   }
  //   setIsBedrijf(user?.organizationMemberships?.length > 0);
  // }, [isLoaded, isSignedIn, user, router]);

  // useEffect(() => {
  //   const fetchOnboardingStatus = async () => {
  //     if (isBedrijf === null) return;
  //     try {
  //       const userId = user?.id;
  //       if (!userId) throw new Error('User ID missing');

  //       const response = isBedrijf
  //         ? await checkOnboardingStatusEmployer(userId)
  //         : await checkOnboardingStatusEmployee(userId);
  //       setIsOnboarded(response);
  //       setIsLoading(false)
  //     } catch (error) {
  //       console.error('Error:', error);
  //       router.push('/onboarding');
  //     }
  //   };
  //   fetchOnboardingStatus();
  // }, [isBedrijf, user, router]);

  // // Redirect based on state
  // useEffect(() => {
  //   if (!isLoaded) return;
  //   if (!isSignedIn) {
  //     router.push('/sign-in');
  //   } else if (isOnboarded === false) {
  //     router.push('/verifieren');
  //   }
  // }, [isLoaded, isSignedIn, isOnboarded, router]);
  
  // Fetch the dictionary data