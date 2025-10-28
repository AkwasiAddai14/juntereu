import { toast } from "@/app/[lang]/components/ui/use-toast";

export interface ErrorHandlerOptions {
  showToast?: boolean;
  fallbackValue?: any;
  errorMessage?: string;
  successMessage?: string;
}

/**
 * Handles errors gracefully with toast notifications and fallback values
 */
export const handleError = (
  error: any,
  options: ErrorHandlerOptions = {}
): any => {
  const {
    showToast = true,
    fallbackValue = '',
    errorMessage = 'An error occurred',
    successMessage
  } = options;

  // Log error for debugging
  console.error('Error handled:', error);

  // Show toast notification if enabled
  if (showToast) {
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  }

  // Return fallback value
  return fallbackValue;
};

/**
 * Wraps async functions with error handling
 */
export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T> => {
  try {
    const result = await asyncFn();
    return result;
  } catch (error) {
    return handleError(error, options);
  }
};

/**
 * Safe data access with fallback
 */
export const safeGet = (obj: any, path: string, fallback: any = ''): any => {
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

/**
 * Toast notification helpers
 */
export const showErrorToast = (message: string) => {
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
};

export const showSuccessToast = (message: string) => {
  toast({
    title: "Success",
    description: message,
    variant: "default",
  });
};

export const showWarningToast = (message: string) => {
  toast({
    title: "Warning",
    description: message,
    variant: "destructive",
  });
};
