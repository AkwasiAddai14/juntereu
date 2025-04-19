"use client";

import { useUser } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkOnboardingStatusEmployer } from '@/app/lib/actions/employer.actions';
import { checkOnboardingStatusEmployee } from '@/app/lib/actions/employee.actions';


const EmployeeDashboard = dynamic(() => import('@/app/[lang]/components/dashboard/EmployeeDashboard/Dashboard/dashboard'));
const EmployerDashboard = dynamic(() => import('@/app/[lang]/components/dashboard/CompanyDashboard/dashboard'));

const DashboardPage = () => {
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
      {isBedrijf ? <EmployerDashboard /> : <EmployeeDashboard /> }
    </div>
  );
};

export default DashboardPage;