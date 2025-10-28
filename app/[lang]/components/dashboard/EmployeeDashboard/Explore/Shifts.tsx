'use client'

import * as React from "react";
import mongoose from "mongoose";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/app/[lang]/components/ui/scroll-area";
import ShiftCard from '@/app/[lang]/components/shared/cards/Wrappers/ShiftArrayWrapper';
import { haalShift } from "@/app/lib/actions/shiftArray.actions"
import type { Locale } from '@/app/[lang]/dictionaries';
import SharedFilters from "./SharedFilters";

interface Props {
  lang: Locale;
  dashboard: any;
}

export default function Shifts ({ lang, dashboard }: Props){
  const { isLoaded, user } = useUser();
  const [freelancerId, setFreelancerId] = useState<any>(null);
  const [shift, setShift] = useState<any[]>([]);

  useEffect(() => {
    if (isLoaded && user) {
      setFreelancerId(user?.id)
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await haalShift(freelancerId as unknown as mongoose.Types.ObjectId);

        if (response) {
          // Sort the shifts by date
          
          const sortedShifts = response.sort((a: any, b: any) => {
            return new Date(a.begindatum).getTime() - new Date(b.begindatum).getTime(); // Ascending order
          });
          console.log(sortedShifts)
          setShift(sortedShifts); // Set the sorted shifts
        } else {
          setShift([]); // Handle case where response is empty or null
        }
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };
    fetchShifts();
  }, [freelancerId]);

    return (
      <div className="flex gap-6">
        {/* Left Sidebar - Filters */}
        <div className="w-80 flex-shrink-0">
          <SharedFilters dashboard={dashboard} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1">
          <h1 className='mb-10 items-center justify-center text-4xl'>{dashboard?.werknemersPage?.Explore?.ShiftPagina?.headTitle || 'Shifts'}</h1>
          <ScrollArea>
            {shift && shift.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {shift.slice(0, shift.length).map((shiftItem, index) => (
                  <ShiftCard key={index} shift={shiftItem} lang={lang}/>
                ))}
              </div>
            ) : ( 
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-gray-500 text-lg">
                  {dashboard?.werknemersPage?.Explore?.ShiftPagina?.NoShifts || 'No shifts available'}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    )
}