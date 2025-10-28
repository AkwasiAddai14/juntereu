import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Check if the current user is part of any organization
 * @returns Promise<boolean> - true if user has organization memberships, false otherwise
 */
export async function isUserInOrganization(): Promise<boolean> {
  try {
    const user = await currentUser();
    
    if (!user) {
      console.log('Server: No user found');
      return false;
    }

    console.log('Server: User found:', user.id, user.emailAddresses?.[0]?.emailAddress);

    // First try to check if user has organizationMemberships property (fallback)
    if ((user as any).organizationMemberships && (user as any).organizationMemberships.length > 0) {
      console.log('Server: Found organization memberships via user property:', (user as any).organizationMemberships.length);
      return true;
    }

    // Get user's organization memberships using Clerk API
    const client = await clerkClient();
    const memberships = await client.users.getOrganizationMembershipList({
      userId: user.id
    });
    
    console.log('Server: Raw memberships response:', JSON.stringify(memberships, null, 2));
    
    const hasOrganizationMemberships = memberships.data && memberships.data.length > 0;
    
    console.log('Server: User organization memberships count:', memberships.data?.length || 0);
    console.log('Server: Is user in organization:', hasOrganizationMemberships);
    
    if (memberships.data && memberships.data.length > 0) {
      console.log('Server: Organization details:', memberships.data.map(m => ({
        organizationId: m.organization.id,
        organizationName: m.organization.name,
        role: m.role
      })));
    }
    
    return hasOrganizationMemberships;
  } catch (error) {
    console.error('Server: Error checking organization membership:', error);
    return false;
  }
}

/**
 * Get the user's organization memberships
 * @returns Promise<Array> - array of organization memberships
 */
export async function getUserOrganizationMemberships(): Promise<any[]> {
  try {
    const user = await currentUser();
    
    if (!user) {
      console.log('No user found');
      return [];
    }

    const client = await clerkClient();
    const memberships = await client.users.getOrganizationMembershipList({
      userId: user.id
    });

    return memberships.data || [];
  } catch (error) {
    console.error('Error getting organization memberships:', error);
    return [];
  }
}

/**
 * Check if user is an admin of any organization
 * @returns Promise<boolean> - true if user is admin of any organization
 */
export async function isUserOrganizationAdmin(): Promise<boolean> {
  try {
    const memberships = await getUserOrganizationMemberships();
    
    return memberships.some(membership => membership.role === 'admin');
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get the user's primary organization (first organization they're a member of)
 * @returns Promise<object|null> - primary organization or null
 */
export async function getUserPrimaryOrganization(): Promise<any | null> {
  try {
    const memberships = await getUserOrganizationMemberships();
    
    if (memberships.length === 0) {
      return null;
    }

    return memberships[0];
  } catch (error) {
    console.error('Error getting primary organization:', error);
    return null;
  }
}
