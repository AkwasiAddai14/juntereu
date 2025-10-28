/**
 * Utility functions for URL obfuscation
 */

/**
 * Encodes a path to base64 for URL obfuscation
 * @param path - The path to encode (e.g., "/dashboard/flexpool/employer/123")
 * @returns Base64 encoded string
 */
export function encodePath(path: string): string {
  return Buffer.from(path, 'utf-8').toString('base64');
}

/**
 * Decodes a base64 encoded path
 * @param encodedPath - The base64 encoded path
 * @returns Decoded path string
 */
export function decodePath(encodedPath: string): string {
  return Buffer.from(encodedPath, 'base64').toString('utf-8');
}

/**
 * Creates an obfuscated URL for a given path
 * @param lang - The language code
 * @param path - The path to obfuscate
 * @returns Obfuscated URL
 */
export function createObfuscatedUrl(lang: string, path: string): string {
  const encodedPath = encodePath(path);
  return `/${lang}/dashboard/view/${encodedPath}`;
}

/**
 * Examples of usage:
 * 
 * // For flexpool employer page
 * const obfuscatedUrl = createObfuscatedUrl('en', '/dashboard/flexpool/employer/68fe47827c78431653a569cc');
 * // Result: /en/dashboard/view/L2Rhc2hib2FyZC9mbGV4cG9vbC9lbXBsb3llci82OGZlNDc4MjdjNzg0MzE2NTNhNTY5Y2M
 * 
 * // For shift employee page
 * const obfuscatedUrl = createObfuscatedUrl('en', '/dashboard/shift/employee/123');
 * // Result: /en/dashboard/view/L2Rhc2hib2FyZC9zaGlmdC9lbXBsb3llZS8xMjM=
 */
