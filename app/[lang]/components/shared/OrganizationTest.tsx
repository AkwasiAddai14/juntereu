"use client";

import { useOrganization } from '@/app/lib/hooks/useOrganization';

/**
 * Test component to demonstrate organization checking
 * This can be added to any page to test organization functionality
 */
export default function OrganizationTest() {
  const { 
    isInOrganization, 
    isAdmin, 
    membershipCount, 
    primaryOrganization, 
    isLoaded,
    memberships 
  } = useOrganization();

  if (!isLoaded) {
    return (
      <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Organization Test</h3>
        <p>Loading organization data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Organization Test</h3>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">In Organization:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            isInOrganization ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isInOrganization ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Is Admin:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            isAdmin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isAdmin ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Membership Count:</span>
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
            {membershipCount}
          </span>
        </div>

        {primaryOrganization && (
          <div className="mt-3 p-3 bg-blue-50 rounded">
            <h4 className="font-medium text-blue-900">Primary Organization:</h4>
            <p className="text-blue-700">Name: {primaryOrganization.name}</p>
            <p className="text-blue-700">ID: {primaryOrganization.id}</p>
          </div>
        )}

        {memberships.length > 0 && (
          <div className="mt-3">
            <h4 className="font-medium mb-2">All Memberships:</h4>
            <div className="space-y-1">
              {memberships.map((membership, index) => (
                <div key={index} className="p-2 bg-white rounded border">
                  <p className="text-sm">
                    <span className="font-medium">Organization:</span> {membership.organization.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Role:</span> {membership.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
