"use client";

import { useUser } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Custom hook to check organization membership status
 * @returns object with organization status and utilities
 */
export function useOrganization() {
  const { user, isLoaded } = useUser();

  const organizationData = useMemo(() => {
    if (!isLoaded || !user) {
      return {
        isInOrganization: false,
        memberships: [],
        isAdmin: false,
        primaryOrganization: null,
        membershipCount: 0
      };
    }

    const memberships = user.organizationMemberships || [];
    const isInOrganization = memberships.length > 0;
    const isAdmin = memberships.some(membership => membership.role === 'admin');
    const primaryOrganization = memberships.length > 0 ? memberships[0].organization : null;

    return {
      isInOrganization,
      memberships,
      isAdmin,
      primaryOrganization,
      membershipCount: memberships.length
    };
  }, [user, isLoaded]);

  return {
    ...organizationData,
    isLoaded,
    user
  };
}
