"use client";

import { useUser } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkOnboardingStatusEmployer } from '@/app/lib/actions/employer.actions';
import { checkOnboardingStatusEmployee } from '@/app/lib/actions/employee.actions';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];
const EmployeeDashboard = dynamic(() => import('@/app/[lang]/components/dashboard/EmployeeDashboard/Dashboard/DashboardWrapper'));
const EmployerDashboard = dynamic(() => import('@/app/[lang]/components/dashboard/CompanyDashboard/Dashboard/DashboardWrapper'));

/* const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
  'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
]; */

const DashboardPage = ({ params }: { params: { lang: string } }) => {
  const lang = supportedLocales.includes(params.lang as Locale) ? (params.lang as Locale): 'en';
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isBedrijf ? <EmployerDashboard lang={lang} /> : <EmployeeDashboard lang={lang} /> }
    </div>
  );
};

export default DashboardPage;