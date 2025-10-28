"use server";

import { isUserInOrganization, getUserOrganizationMemberships, isUserOrganizationAdmin, getUserPrimaryOrganization } from '@/app/lib/utils/organization';

/**
 * Server action to get user's organization status
 */
export async function getUserOrganizationStatus() {
  try {
    const isInOrganization = await isUserInOrganization();
    const memberships = await getUserOrganizationMemberships();
    const isAdmin = await isUserOrganizationAdmin();
    const primaryOrganization = await getUserPrimaryOrganization();

    return {
      isInOrganization,
      memberships,
      isAdmin,
      primaryOrganization,
      membershipCount: memberships.length
    };
  } catch (error) {
    console.error('Error getting organization status:', error);
    return {
      isInOrganization: false,
      memberships: [],
      isAdmin: false,
      primaryOrganization: null,
      membershipCount: 0
    };
  }
}

/**
 * Server action to check if user is in organization
 */
export async function checkUserInOrganization(): Promise<boolean> {
  try {
    return await isUserInOrganization();
  } catch (error) {
    console.error('Error checking organization membership:', error);
    return false;
  }
}

/**
 * Server action to get user's organization memberships
 */
export async function getUserMemberships() {
  try {
    return await getUserOrganizationMemberships();
  } catch (error) {
    console.error('Error getting memberships:', error);
    return [];
  }
}
