# Organization Membership Checking

This guide shows how to check if a user is part of an organization using Clerk's organization memberships.

## Server-Side Utilities

### `app/lib/utils/organization.ts`

Server-side utilities for checking organization membership:

```typescript
import { isUserInOrganization, getUserOrganizationMemberships, isUserOrganizationAdmin, getUserPrimaryOrganization } from '@/app/lib/utils/organization';

// Check if user is in any organization
const isInOrg = await isUserInOrganization();

// Get all organization memberships
const memberships = await getUserOrganizationMemberships();

// Check if user is admin of any organization
const isAdmin = await isUserOrganizationAdmin();

// Get primary organization
const primaryOrg = await getUserPrimaryOrganization();
```

### `app/lib/actions/organization.actions.ts`

Server actions for organization checking:

```typescript
import { getUserOrganizationStatus, checkUserInOrganization } from '@/app/lib/actions/organization.actions';

// Get complete organization status
const status = await getUserOrganizationStatus();

// Simple boolean check
const isInOrg = await checkUserInOrganization();
```

## Client-Side Utilities

### `app/lib/hooks/useOrganization.ts`

Custom hook for client-side organization checking:

```typescript
import { useOrganization } from '@/app/lib/hooks/useOrganization';

function MyComponent() {
  const { 
    isInOrganization, 
    isAdmin, 
    membershipCount, 
    primaryOrganization, 
    isLoaded 
  } = useOrganization();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      {isInOrganization ? (
        <div>You are in an organization</div>
      ) : (
        <div>You are not in an organization</div>
      )}
    </div>
  );
}
```

### `app/[lang]/components/shared/OrganizationChecker.tsx`

Render prop component for organization data:

```typescript
import OrganizationChecker from '@/app/[lang]/components/shared/OrganizationChecker';

<OrganizationChecker>
  {({ isInOrganization, isAdmin, membershipCount }) => (
    <div>
      {isInOrganization ? 'In organization' : 'Not in organization'}
    </div>
  )}
</OrganizationChecker>
```

## Usage Examples

### 1. Dashboard Routing

```typescript
// app/[lang]/dashboard/page.tsx
import { isUserInOrganization } from '@/app/lib/utils/organization';

export default async function DashboardPage() {
  const isInOrganization = await isUserInOrganization();
  
  return (
    <div>
      {isInOrganization ? (
        <EmployerDashboard />
      ) : (
        <EmployeeDashboard />
      )}
    </div>
  );
}
```

### 2. Conditional Rendering

```typescript
import { useOrganization } from '@/app/lib/hooks/useOrganization';

function MyComponent() {
  const { isInOrganization, isAdmin } = useOrganization();

  return (
    <div>
      {isInOrganization && (
        <div>Organization features</div>
      )}
      
      {isAdmin && (
        <div>Admin features</div>
      )}
    </div>
  );
}
```

### 3. Server Component with Organization Check

```typescript
import { getUserOrganizationStatus } from '@/app/lib/actions/organization.actions';

export default async function MyServerComponent() {
  const { isInOrganization, isAdmin } = await getUserOrganizationStatus();

  return (
    <div>
      {isInOrganization ? (
        <div>Organization content</div>
      ) : (
        <div>Individual user content</div>
      )}
    </div>
  );
}
```

## Available Data

The organization utilities provide:

- `isInOrganization`: boolean - true if user has any organization memberships
- `isAdmin`: boolean - true if user is admin of any organization
- `membershipCount`: number - number of organization memberships
- `primaryOrganization`: object - first organization the user is a member of
- `memberships`: array - all organization memberships
- `isLoaded`: boolean - whether Clerk data is loaded

## Error Handling

All utilities include proper error handling and will return safe defaults if there are any issues with Clerk or the user data.

## Performance Notes

- Server-side utilities are cached and efficient
- Client-side hook uses React's useMemo for optimization
- Organization data is only fetched when needed
