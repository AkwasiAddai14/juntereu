"use client";

import { useOrganization } from '@/app/lib/hooks/useOrganization';
import OrganizationChecker from './OrganizationChecker';

/**
 * Example 1: Using the hook directly
 */
export function DirectHookExample() {
  const { isInOrganization, isAdmin, membershipCount } = useOrganization();

  return (
    <div>
      <h3>Direct Hook Example</h3>
      <p>In organization: {isInOrganization ? 'Yes' : 'No'}</p>
      <p>Is admin: {isAdmin ? 'Yes' : 'No'}</p>
      <p>Membership count: {membershipCount}</p>
    </div>
  );
}

/**
 * Example 2: Using the OrganizationChecker component
 */
export function OrganizationCheckerExample() {
  return (
    <OrganizationChecker>
      {({ isInOrganization, isAdmin, membershipCount, primaryOrganization, isLoaded }) => (
        <div>
          <h3>Organization Checker Example</h3>
          {isLoaded ? (
            <>
              <p>In organization: {isInOrganization ? 'Yes' : 'No'}</p>
              <p>Is admin: {isAdmin ? 'Yes' : 'No'}</p>
              <p>Membership count: {membershipCount}</p>
              {primaryOrganization && (
                <p>Primary org: {primaryOrganization.name}</p>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </OrganizationChecker>
  );
}

/**
 * Example 3: Conditional rendering based on organization status
 */
export function ConditionalRenderingExample() {
  const { isInOrganization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isInOrganization ? (
        <div>
          <h3>Employer Dashboard</h3>
          <p>You have access to employer features</p>
        </div>
      ) : (
        <div>
          <h3>Employee Dashboard</h3>
          <p>You have access to employee features</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: Admin-only content
 */
export function AdminOnlyExample() {
  const { isAdmin, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAdmin ? (
        <div>
          <h3>Admin Panel</h3>
          <p>You have admin privileges</p>
          <button>Manage Organization</button>
        </div>
      ) : (
        <div>
          <p>You need admin privileges to access this content</p>
        </div>
      )}
    </div>
  );
}
