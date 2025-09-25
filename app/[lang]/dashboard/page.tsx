"use client";

import { useUser } from '@clerk/nextjs';
import dynamicImport from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { checkOnboardingStatusEmployer } from '@/app/lib/actions/employer.actions';
import { checkOnboardingStatusEmployee } from '@/app/lib/actions/employee.actions';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

// Make this route request-bound so Clerk has context
export const dynamic = "force-dynamic";

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];
const EmployeeDashboard = dynamicImport(() => import('@/app/[lang]/components/dashboard/EmployeeDashboard/Dashboard/DashboardWrapper'));
const EmployerDashboard = dynamicImport(() => import('@/app/[lang]/components/dashboard/CompanyDashboard/Dashboard/DashboardWrapper'));

/* const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
  'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
]; */

const DashboardPage = ({ params }: { params: Promise<{ lang: string }> }) => {
  const resolvedParams = use(params);
  const lang = supportedLocales.includes(resolvedParams.lang as Locale) ? (resolvedParams.lang as Locale): 'en';
  const { isLoaded, isSignedIn, user } = useUser();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [isBedrijf, setIsBedrijf] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    setIsBedrijf(user?.organizationMemberships?.length > 0);
  }, [isLoaded, isSignedIn, user, router]);

  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      if (isBedrijf === null) return;
      try {
        const userId = user?.id;
        if (!userId) throw new Error('User ID missing');

        const response = isBedrijf
          ? await checkOnboardingStatusEmployer(userId)
          : await checkOnboardingStatusEmployee(userId);
        setIsOnboarded(response);
        setIsLoading(false)
      } catch (error) {
        console.error('Error:', error);
        router.push('/sign-in');
      }
    };
    fetchOnboardingStatus();
  }, [isBedrijf, user, router]);

  // Redirect based on state
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push('/sign-in');
    } else if (isOnboarded === false) {
      router.push('/verifieren');
    }
  }, [isLoaded, isSignedIn, isOnboarded, router]);

  if (!isLoaded || isLoading) {
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
      {isBedrijf ? <EmployerDashboard lang={lang} /> : <EmployeeDashboard lang={lang} /> }
    </div>
  );
};

export default DashboardPage;