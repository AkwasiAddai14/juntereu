/**
 * Utility functions for serializing data to prevent Next.js serialization errors
 */

/**
 * Serialize Mongoose documents or any objects with toJSON methods to plain objects
 * @param data - The data to serialize
 * @returns Serialized plain object or array
 */
export function serializeData<T>(data: T): T {
  try {
    // First try the standard JSON serialization
    const serialized = JSON.parse(JSON.stringify(data));
    return serialized;
  } catch (error) {
    console.error('Error serializing data:', error);
    // If JSON serialization fails, try a more aggressive approach
    try {
      return JSON.parse(JSON.stringify(data, (key, value) => {
        // Convert ObjectIds to strings
        if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'ObjectId') {
          return value.toString();
        }
        // Convert Date objects to ISO strings
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      }));
    } catch (secondError) {
      console.error('Error in fallback serialization:', secondError);
      return data;
    }
  }
}

/**
 * Serialize an array of Mongoose documents
 * @param documents - Array of Mongoose documents
 * @returns Serialized array of plain objects
 */
export function serializeDocuments<T>(documents: T[]): T[] {
  try {
    return JSON.parse(JSON.stringify(documents));
  } catch (error) {
    console.error('Error serializing documents:', error);
    return documents;
  }
}

/**
 * Serialize a single Mongoose document
 * @param document - Mongoose document
 * @returns Serialized plain object
 */
export function serializeDocument<T>(document: T): T {
  try {
    return JSON.parse(JSON.stringify(document));
  } catch (error) {
    console.error('Error serializing document:', error);
    return document;
  }
}

/**
 * Check if data contains Mongoose documents that need serialization
 * @param data - The data to check
 * @returns True if data needs serialization
 */
export function needsSerialization(data: any): boolean {
  if (data === null || data === undefined) return false;
  
  // Check if it's an array
  if (Array.isArray(data)) {
    return data.some(item => needsSerialization(item));
  }
  
  // Check if it's an object with Mongoose-specific properties
  if (typeof data === 'object') {
    return (
      data._id !== undefined ||
      data.__v !== undefined ||
      typeof data.toJSON === 'function' ||
      typeof data.toObject === 'function'
    );
  }
  
  return false;
}
