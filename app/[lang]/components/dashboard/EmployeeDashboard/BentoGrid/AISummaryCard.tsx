'use client'

import { useAISummary } from '@/app/lib/ai-summary';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface AISummaryCardProps {
  section: 'shifts' | 'applications' | 'work' | 'education' | 'overview';
  userData: any;
  title: string;
  className?: string;
}

export function AISummaryCard({ section, userData, title, className = '' }: AISummaryCardProps) {
  const { summary, loading, error } = useAISummary(userData, section);

  return (
    <div className={`p-4 pt-2 border-t border-gray-100 ${className}`}>
      <h3 className="text-sm/4 font-semibold text-sky-600">{title}</h3>
       <p className="mt-2 text-lg font-medium tracking-tight text-gray-950"></p>
     {/*  <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Generating personalized summary...
          </span>
        ) : error ? (
          'Je dashboard toont je recente activiteit en prestaties.'
        ) : (
          summary
        )}
      </p>  */}
    </div>
  );
}
