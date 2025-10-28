/**
 * Example usage of the country-specific database connection system
 * 
 * This file demonstrates how to use the database connection utilities
 * in different scenarios throughout your application.
 */

import { 
  getDatabaseConnection, 
  getCountryFunctions, 
  isConnectedToCountry,
  getConnectedDatabases 
} from '../database-connection';

import { 
  ensureDatabaseConnection, 
  getDatabaseForOperation,
  logDatabaseStatus 
} from '../utils/database-utils';

import { currentUser } from "@clerk/nextjs/server";

// Example 1: Basic database connection for a specific country
export async function exampleBasicConnection() {
  try {
    // Connect to Netherlands database
    const connected = await getDatabaseConnection('Nederland');
    
    if (connected) {
      console.log('✅ Connected to Netherlands database');
      // Your database operations here
    } else {
      console.error('❌ Failed to connect to Netherlands database');
    }
  } catch (error) {
    console.error('Error in basic connection:', error);
  }
}

// Example 2: Get user's country and connect to appropriate database
export async function exampleUserCountryConnection() {
  try {
    const user = await currentUser();
    const userCountry = user?.unsafeMetadata?.country as string;
    
    if (!userCountry) {
      console.log('No country found in user metadata, using default');
      return await getDatabaseConnection(); // Uses default database
    }
    
    const connected = await getDatabaseConnection(userCountry);
    
    if (connected) {
      console.log(`✅ Connected to ${userCountry} database`);
      
      // Get country-specific functions
      const functions = await getCountryFunctions(userCountry);
      console.log('Available functions:', functions);
      
      // Your database operations here
    } else {
      console.error(`❌ Failed to connect to ${userCountry} database`);
    }
  } catch (error) {
    console.error('Error in user country connection:', error);
  }
}

// Example 3: Ensure database connection with comprehensive error handling
export async function exampleEnsureConnection() {
  try {
    const dbInfo = await ensureDatabaseConnection('Belgie');
    
    if (!dbInfo.connected) {
      console.error('Database connection failed:', dbInfo.error);
      return false;
    }
    
    console.log(`✅ Connected to ${dbInfo.country} database`);
    console.log('Available functions:', dbInfo.functions);
    
    // Your database operations here
    return true;
    
  } catch (error) {
    console.error('Error ensuring connection:', error);
    return false;
  }
}

// Example 4: Get database for specific operation
export async function exampleOperationSpecificConnection() {
  try {
    const dbInfo = await getDatabaseForOperation('createEmployee', 'Frankrijk');
    
    if (!dbInfo.connected) {
      console.error('Database connection failed:', dbInfo.error);
      return false;
    }
    
    console.log(`✅ Connected to ${dbInfo.country} database`);
    console.log(`Should use country function: ${dbInfo.useCountryFunction}`);
    console.log(`Function name: ${dbInfo.functionName}`);
    
    // Your employee creation logic here
    if (dbInfo.useCountryFunction) {
      // Use country-specific function
      console.log(`Calling ${dbInfo.functionName} for ${dbInfo.country}`);
    } else {
      // Use default function
      console.log('Using default employee creation function');
    }
    
    return true;
    
  } catch (error) {
    console.error('Error in operation-specific connection:', error);
    return false;
  }
}

// Example 5: Check connection status and get connected databases
export async function exampleConnectionStatus() {
  try {
    // Log current database status
    await logDatabaseStatus();
    
    // Check if connected to specific country
    const isConnectedToNL = await isConnectedToCountry('Nederland');
    console.log('Connected to Netherlands:', isConnectedToNL);
    
    // Get all connected databases
    const connectedDbs = await getConnectedDatabases();
    console.log('Connected databases:', connectedDbs);
    
  } catch (error) {
    console.error('Error checking connection status:', error);
  }
}

// Example 6: Form submission with database connection
export async function exampleFormSubmission(formData: any, country: string) {
  try {
    console.log('Processing form submission for country:', country);
    
    // Ensure proper database connection
    const dbInfo = await ensureDatabaseConnection(country);
    
    if (!dbInfo.connected) {
      throw new Error(`Database connection failed: ${dbInfo.error}`);
    }
    
    console.log(`✅ Connected to ${dbInfo.country} database`);
    console.log('Available functions:', dbInfo.functions);
    
    // Determine which function to use based on country
    const shouldUseCountryFunction = dbInfo.functions.createEmployee === 'createNCEmployee';
    
    if (shouldUseCountryFunction) {
      console.log(`Using country-specific function for ${country}`);
      // Call country-specific function
      // await createNCEmployee(formData);
    } else {
      console.log('Using default function');
      // Call default function
      // await createEmployee(formData);
    }
    
    console.log('Form processed successfully');
    return true;
    
  } catch (error) {
    console.error('Error processing form:', error);
    throw error;
  }
}

// Example 7: Batch operations for multiple countries
export async function exampleBatchOperations() {
  const countries = ['Nederland', 'Belgie', 'Frankrijk', 'Duitsland'];
  
  try {
    for (const country of countries) {
      console.log(`Processing operations for ${country}`);
      
      const connected = await getDatabaseConnection(country);
      
      if (connected) {
        console.log(`✅ Connected to ${country} database`);
        
        // Your batch operations here
        // await processCountryData(country);
        
      } else {
        console.error(`❌ Failed to connect to ${country} database`);
      }
    }
    
  } catch (error) {
    console.error('Error in batch operations:', error);
  }
}

// Example 8: Error handling and fallback
export async function exampleWithFallback(country: string) {
  try {
    // Try to connect to country-specific database
    let connected = await getDatabaseConnection(country);
    
    if (!connected) {
      console.warn(`Failed to connect to ${country} database, trying fallback`);
      
      // Try default database as fallback
      connected = await getDatabaseConnection();
      
      if (!connected) {
        throw new Error('All database connections failed');
      }
      
      console.log('✅ Connected to fallback database');
    } else {
      console.log(`✅ Connected to ${country} database`);
    }
    
    // Your operations here
    
  } catch (error) {
    console.error('Error with fallback:', error);
    throw error;
  }
}
