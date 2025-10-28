"use client";

import { useOrganization } from '@/app/lib/hooks/useOrganization';

/**
 * Component that displays the user's organization status
 */
export default function OrganizationStatus() {
  const { 
    isInOrganization, 
    isAdmin, 
    membershipCount, 
    primaryOrganization, 
    isLoaded 
  } = useOrganization();

  if (!isLoaded) {
    return <div>Loading organization status...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Organization Status</h3>
      
      {isInOrganization ? (
        <div>
          <p className="text-green-600">✅ You are part of an organization</p>
          <p>Membership count: {membershipCount}</p>
          {isAdmin && <p className="text-blue-600">🔑 You are an admin</p>}
          {primaryOrganization && (
            <div>
              <p>Primary organization: {primaryOrganization.name}</p>
              <p>Organization ID: {primaryOrganization.id}</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-gray-600">❌ You are not part of any organization</p>
          <p>You will see the Employee Dashboard</p>
        </div>
      )}
    </div>
  );
}
