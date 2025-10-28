"use client";

import { useOrganization } from '@/app/lib/hooks/useOrganization';

interface OrganizationCheckerProps {
  children: (organizationData: {
    isInOrganization: boolean;
    isAdmin: boolean;
    membershipCount: number;
    primaryOrganization: any;
    isLoaded: boolean;
  }) => React.ReactNode;
}

/**
 * Component that provides organization data to its children via render prop
 */
export default function OrganizationChecker({ children }: OrganizationCheckerProps) {
  const organizationData = useOrganization();

  return <>{children(organizationData)}</>;
}

/**
 * Hook to use organization data in any component
 */
export function useOrganizationData() {
  return useOrganization();
}
