"use client";

import { useState, useCallback } from 'react';
import { generateAIFillData, AIFillResult, EmployerData } from '@/app/lib/services/ai-fill.service';

export interface UseAIFillOptions {
  employer: EmployerData;
  documentType: 'vacancy' | 'shift';
  existingDocuments?: any[];
  onSuccess?: (data: AIFillResult) => void;
  onError?: (error: Error) => void;
}

export interface UseAIFillReturn {
  generateAIFillData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  lastGeneratedData: AIFillResult | null;
}

export const useAIFill = ({
  employer,
  documentType,
  existingDocuments = [],
  onSuccess,
  onError
}: UseAIFillOptions): UseAIFillReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGeneratedData, setLastGeneratedData] = useState<AIFillResult | null>(null);

  const generateData = useCallback(async () => {
    if (!employer?._id) {
      const errorMsg = 'No employer data available for AI fill';
      setError(errorMsg);
      onError?.(new Error(errorMsg));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🤖 Starting AI fill generation...', {
        employer: employer.name,
        documentType,
        existingDocumentsCount: existingDocuments.length
      });

      const result = await generateAIFillData(
        employer,
        documentType,
        existingDocuments
      );

      console.log('✅ AI fill generation successful:', result);
      
      setLastGeneratedData(result);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ AI fill generation failed:', errorMessage);
      
      setError(errorMessage);
      onError?.(new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [employer, documentType, existingDocuments, onSuccess, onError]);

  return {
    generateAIFillData: generateData,
    isLoading,
    error,
    lastGeneratedData
  };
};
