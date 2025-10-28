"use server";

import { getDatabaseConnection, getCountryFunctions, isConnectedToCountry } from '../database-connection';
import { currentUser } from "@clerk/nextjs/server";

/**
 * Utility function to ensure proper database connection for form submissions
 * @param country - Optional country parameter, if not provided will get from user metadata
 * @returns Promise<{connected: boolean, country: string, functions: any}>
 */
export async function ensureDatabaseConnection(country?: string) {
  try {
    let targetCountry = country;

    // If no country provided, get from user metadata
    if (!targetCountry) {
      const user = await currentUser();
      targetCountry = user?.unsafeMetadata?.country as string;
    }

    // If still no country, use default
    if (!targetCountry) {
      console.log("No country found, using default database");
      targetCountry = 'Nederland'; // Default fallback
    }

    // Check if already connected to this country's database
    if (await isConnectedToCountry(targetCountry)) {
      console.log(`Already connected to ${targetCountry} database`);
      return {
        connected: true,
        country: targetCountry,
        functions: await getCountryFunctions(targetCountry)
      };
    }

    // Connect to the appropriate database
    const connected = await getDatabaseConnection(targetCountry);
    
    if (!connected) {
      console.error(`Failed to connect to database for ${targetCountry}`);
      return {
        connected: false,
        country: targetCountry,
        functions: await getCountryFunctions(targetCountry),
        error: 'Database connection failed'
      };
    }

    return {
      connected: true,
      country: targetCountry,
      functions: await getCountryFunctions(targetCountry)
    };

  } catch (error) {
    console.error("Error ensuring database connection:", error);
    return {
      connected: false,
      country: country || 'Nederland',
      functions: await getCountryFunctions(country || 'Nederland'),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get the appropriate database connection for a specific operation
 * @param operation - The operation type (e.g., 'createEmployee', 'createEmployer')
 * @param country - Optional country parameter
 * @returns Promise<{connected: boolean, country: string, useCountryFunction: boolean}>
 */
export async function getDatabaseForOperation(operation: 'createEmployee' | 'createEmployer', country?: string) {
  try {
    const dbInfo = await ensureDatabaseConnection(country);
    
    if (!dbInfo.connected) {
      return {
        connected: false,
        country: dbInfo.country,
        useCountryFunction: false,
        error: dbInfo.error
      };
    }

    // Check if this operation should use country-specific function
    const shouldUseCountryFunction = dbInfo.functions[operation] && 
      (dbInfo.functions[operation] === 'createNCEmployee' || 
       dbInfo.functions[operation] === 'maakGLBedrijf');

    return {
      connected: true,
      country: dbInfo.country,
      useCountryFunction: shouldUseCountryFunction,
      functionName: dbInfo.functions[operation]
    };

  } catch (error) {
    console.error("Error getting database for operation:", error);
    return {
      connected: false,
      country: country || 'Nederland',
      useCountryFunction: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Log database connection status for debugging
 * @param country - The country to check
 */
export async function logDatabaseStatus(country?: string) {
  try {
    const user = await currentUser();
    const userCountry = user?.unsafeMetadata?.country as string;
    const targetCountry = country || userCountry || 'Nederland';
    
    console.log('=== Database Connection Status ===');
    console.log(`User country from metadata: ${userCountry}`);
    console.log(`Target country: ${targetCountry}`);
    console.log(`Connected to ${targetCountry}: ${isConnectedToCountry(targetCountry)}`);
    
    const dbInfo = await ensureDatabaseConnection(targetCountry);
    console.log(`Database connection result:`, dbInfo);
    
  } catch (error) {
    console.error("Error logging database status:", error);
  }
}
