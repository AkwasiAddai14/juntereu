import { useState, useEffect } from 'react';

export interface UserData {
  aangemeld: any[];
  sollicitaties: any[];
  geaccepteerd: any[];
  diensten: any[];
  flexpool: any[];
  factuur: any[];
  workExperiences?: any[];
  educations?: any[];
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export interface SummaryOptions {
  section: 'shifts' | 'applications' | 'work' | 'education' | 'overview';
  userData: UserData;
  language?: string;
}

function getFallbackText(section: string, userData: UserData): string {
  const { 
    aangemeld = [], 
    sollicitaties = [], 
    geaccepteerd = [], 
    diensten = [], 
    flexpool = [], 
    factuur = [], 
    workExperiences = [], 
    educations = [] 
  } = userData || {};
  
  const fallbackTexts = {
    shifts: `Je hebt ${aangemeld.length} aangemelde shifts en ${geaccepteerd.length} geaccepteerde shifts. Blijf doorgaan met het zoeken naar nieuwe kansen!`,
    applications: `Je hebt ${sollicitaties.length} actieve sollicitaties. Elke sollicitatie brengt je dichter bij je volgende kans!`,
    work: `Je profiel toont ${workExperiences?.length || 0} werkervaringen en ${educations?.length || 0} opleidingen. Je expertise groeit elke dag!`,
    education: `Je hebt ${educations?.length || 0} opleidingen in je profiel. Blijf investeren in je persoonlijke ontwikkeling!`,
    overview: `Je dashboard toont ${aangemeld.length} aangemelde shifts, ${sollicitaties.length} sollicitaties en ${factuur.length} facturen. Je bent actief bezig met je carrière!`
  };

  return fallbackTexts[section as keyof typeof fallbackTexts] || 'Je dashboard toont je recente activiteit en prestaties.';
}

// Cache for storing generated summaries
const summaryCache = new Map<string, string>();

// Helper function to get cache key
const getCacheKey = (section: string, userData: UserData): string => {
  const userId = userData.user?.email || 'anonymous';
  return `${userId}-${section}`;
};

// Helper function to load from localStorage
const loadFromCache = (cacheKey: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(`ai-summary-${cacheKey}`);
  } catch {
    return null;
  }
};

// Helper function to save to localStorage
const saveToCache = (cacheKey: string, summary: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`ai-summary-${cacheKey}`, summary);
  } catch {
    // Ignore localStorage errors
  }
};

// Hook for using AI summaries in React components
export function useAISummary(userData: UserData, section: SummaryOptions['section']) {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateSummary = async () => {
      // Create a cache key based on user and section
      const cacheKey = getCacheKey(section, userData);
      
      // Check if summary is already cached in memory
      if (summaryCache.has(cacheKey)) {
        setSummary(summaryCache.get(cacheKey)!);
        return;
      }

      // Check if summary is cached in localStorage
      const cachedSummary = loadFromCache(cacheKey);
      if (cachedSummary) {
        setSummary(cachedSummary);
        summaryCache.set(cacheKey, cachedSummary);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/ai-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ section, userData }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate summary');
        }

        const { summary: aiSummary } = await response.json();
        
        // Cache the summary in memory and localStorage
        summaryCache.set(cacheKey, aiSummary);
        saveToCache(cacheKey, aiSummary);
        setSummary(aiSummary);
      } catch (err) {
        setError('Failed to generate summary');
        const fallbackText = getFallbackText(section, userData);
        setSummary(fallbackText);
        // Cache the fallback text as well
        summaryCache.set(cacheKey, fallbackText);
        saveToCache(cacheKey, fallbackText);
      } finally {
        setLoading(false);
      }
    };

    if (userData && Object.keys(userData).length > 0) {
      generateSummary();
    }
  }, [userData, section]);

  return { summary, loading, error };
}

// Function to clear cache (useful for testing or when user data changes significantly)
export function clearAISummaryCache(): void {
  summaryCache.clear();
  if (typeof window !== 'undefined') {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('ai-summary-')) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore localStorage errors
    }
  }
}
