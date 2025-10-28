"use server";

import mongoose from 'mongoose';
import { currentUser } from "@clerk/nextjs/server";
import { determineLocation } from './country';

// Track connections to different databases
const connections: Map<string, boolean> = new Map();

// Country-specific database configurations
const COUNTRY_DB_CONFIG = {
  'Nederland': {
    url: process.env.MONGODB_NL_URL!,
    name: 'junter_nl',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  },
  'Belgie': {
    url: process.env.MONGODB_BE_URL!,
    name: 'junter_be',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  },
  'Frankrijk': {
    url: process.env.MONGODB_FR_URL!,
    name: 'junter_fr',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  },
  'VerenigdKoninkrijk': {
    url: process.env.MONGODB_VK_URL!,
    name: 'junter_uk',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  },
  'Duitsland': {
    url: process.env.MONGODB_DE_URL!,
    name: 'junter_de',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  },
  'Spanje': {
    url: process.env.MONGODB_ES_URL!,
    name: 'junter_es',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  },
  'Italie': {
    url: process.env.MONGODB_IT_URL!,
    name: 'junter_it',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  },
  'Portugal': {
    url: process.env.MONGODB_PT_URL!,
    name: 'junter_pt',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  },
  'Zwitserland': {
    url: process.env.MONGODB_CHF_URL!,
    name: 'junter_ch',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  },
  'Oostenrijk': {
    url: process.env.MONGODB_OS_URL!,
    name: 'junter_at',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  },
  'Denemarken': {
    url: process.env.MONGODB_DK_URL!,
    name: 'junter_dk',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  },
  'Noorwegen': {
    url: process.env.MONGODB_NO_URL!,
    name: 'junter_no',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  },
  'Zweden': {
    url: process.env.MONGODB_ZW_URL!,
    name: 'junter_se',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  },
  'Finland': {
    url: process.env.MONGODB_FI_URL!,
    name: 'junter_fi',
    functions: {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    }
  }
};

/**
 * Connect to the appropriate database based on user's country
 * @param country - The country code/name
 * @returns Promise<boolean> - Connection success status
 */
export async function connectToCountryDatabase(country: string): Promise<boolean> {
  try {
    // Get the database configuration for the country
    const dbConfig = COUNTRY_DB_CONFIG[country as keyof typeof COUNTRY_DB_CONFIG];
    
    if (!dbConfig) {
      console.error(`No database configuration found for country: ${country}`);
      // Fallback to default database
      return await connectToDefaultDatabase();
    }

    // Check if already connected to this database
    if (await isConnectedToCountry(country)) {
      console.log(`Already connected to ${dbConfig.name} database`);
      return true;
    }

    // For now, let's use the default database for all countries
    // This avoids the multiple connection issue
    console.log(`Using default database for ${country} (${dbConfig.name})`);
    
    // Connect to default database if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: 'junter',
      });
    }
    
    connections.set(country, true);
    console.log(`✅ Using default database for ${country}`);
    return true;

  } catch (error) {
    console.error(`Error connecting to database for ${country}:`, error);
    // Fallback to default database
    return await connectToDefaultDatabase();
  }
}

/**
 * Connect to the default database as fallback
 * @returns Promise<boolean> - Connection success status
 */
export async function connectToDefaultDatabase(): Promise<boolean> {
  try {
    if (!process.env.MONGODB_URL) {
      console.error("MONGODB_URL not found in environment variables");
      return false;
    }

    // Check if already connected to default database
    if (await isConnectedToCountry('default')) {
      console.log("Already connected to default database");
      return true;
    }

    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGODB_URL);
    
    if (mongoose.connection.readyState === 1) {
      connections.set('default', true);
      console.log("✅ Connected to default database");
      return true;
    } else {
      console.error("❌ Failed to connect to default database");
      return false;
    }

  } catch (error) {
    console.error("Error connecting to default database:", error);
    return false;
  }
}

/**
 * Get the appropriate database connection based on user's country
 * @param country - Optional country parameter, if not provided will get from user metadata
 * @returns Promise<boolean> - Connection success status
 */
export async function getDatabaseConnection(country?: string): Promise<boolean> {
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
      return await connectToDefaultDatabase();
    }

    console.log(`Connecting to database for country: ${targetCountry}`);
    return await connectToCountryDatabase(targetCountry);

  } catch (error) {
    console.error("Error getting database connection:", error);
    return await connectToDefaultDatabase();
  }
}

/**
 * Get the appropriate function names for a country
 * @param country - The country code/name
 * @returns Object with function names for the country
 */
export async function getCountryFunctions(country: string) {
  const dbConfig = COUNTRY_DB_CONFIG[country as keyof typeof COUNTRY_DB_CONFIG];
  
  if (!dbConfig) {
    console.warn(`No configuration found for country: ${country}, using default functions`);
    return {
      createEmployee: 'createNCEmployee',
      createEmployer: 'maakGLBedrijf'
    };
  }

  return dbConfig.functions;
}

/**
 * Disconnect from all databases
 */
export async function disconnectAllDatabases(): Promise<void> {
  try {
    await mongoose.disconnect();
    connections.clear();
    console.log("Disconnected from all databases");
  } catch (error) {
    console.error("Error disconnecting from databases:", error);
  }
}

/**
 * Check if connected to a specific country's database
 * @param country - The country to check
 * @returns boolean - Connection status
 */
export async function isConnectedToCountry(country: string): Promise<boolean> {
  return connections.get(country) || false;
}

/**
 * Get all connected databases
 * @returns string[] - Array of connected country names
 */
export async function getConnectedDatabases(): Promise<string[]> {
  return Array.from(connections.keys());
}
