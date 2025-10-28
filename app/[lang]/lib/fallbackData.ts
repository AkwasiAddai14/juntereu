import { useUser } from '@clerk/nextjs';

let cachedUser: any = null;
export interface FallbackDataOptions {
  freelancer?: any;
  user?: User | null;
}

/**
 * Fallback data utility that provides data in this priority:
 * 1. Freelancer data (from database)
 * 2. Clerk user data
 * 3. Dummy data
 * 4. Empty string
 */
export const getFallbackData = (field: string, options: FallbackDataOptions) => {
  const { freelancer, user } = options;
  
  // Priority 1: Freelancer data from database
  if (freelancer && freelancer[field]) {
    return freelancer[field];
  }
  
  // Priority 2: Clerk user data
  if (user) {
    const clerkMappings: Record<string, () => any> = {
      profilephoto: () => user.imageUrl,
      firstName: () => user.firstName,
      lastName: () => user.lastName,
      email: () => user.emailAddresses?.[0]?.emailAddress,
      phoneNumber: () => user.phoneNumbers?.[0]?.phoneNumber,
      infix: () => '',
      dateOfBirth: () => '',
      street: () => '',
      housenumber: () => '',
      iban: () => '',
      bio: () => '',
      city: () => '',
      country: () => '',
      skills: () => [],
      rating: () => 0,
      completedJobs: () => 0,
      totalEarnings: () => 0
    };
    
    if (clerkMappings[field]) {
      const clerkValue = clerkMappings[field]();
      if (clerkValue) {
        return clerkValue;
      }
    }
  }
  
  // Priority 3: Dummy data
  const dummyData: Record<string, any> = {
    profilephoto: '/api/placeholder/150/150',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    bio: 'Professional freelancer',
    city: 'Amsterdam',
    country: 'Netherlands',
    skills: ['Web Development', 'Design'],
    rating: 4.5,
    completedJobs: 0,
    totalEarnings: 0,
    infix: '',
    dateOfBirth: '',
    street: '',
    housenumber: '',
    iban: ''
  };
  
  return dummyData[field] || '';
};

/**
 * Safe data access that handles null/undefined objects
 */
export const safeGet = (obj: any, path: string, fallback: any = '') => {
  if (!obj) return fallback;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return fallback;
    }
  }
  
  return current || fallback;
};
