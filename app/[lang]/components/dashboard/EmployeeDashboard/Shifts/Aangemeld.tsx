'use client'
import * as React from "react";
import mongoose from "mongoose";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { haalAangemeld } from "@/app/lib/actions/shift.actions"
import Card from '@/app/[lang]/components/shared/cards/Wrappers/ShiftWrapper';
import { ScrollArea } from "@/app/[lang]/components/ui/scroll-area";
import { haalSollicitatiesFreelancer } from "@/app/lib/actions/vacancy.actions";
import ApplicationCard from "@/app/[lang]/components/shared/cards/Wrappers/ApplicationWrapper";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  lang: Locale;
  dashboard: any;
};

export default function Aangemeld ({ lang, dashboard }: Props) {
    const { isLoaded, user } = useUser();
    const [freelancerId, setFreelancerId] = useState<any>(null);
    const [aangemeld, setAangemeld] = useState<any[]>([]);
    const [sollicitaties, setSollicitaties] = useState <any[]>([]);
    


    useEffect(() => {
        if (isLoaded && user) {
          setFreelancerId(user?.id)
        }
      }, [isLoaded, user]);

    useEffect(() => {
        const fetchAangemeldeShifts = async () => {
          try {
                const response = await haalAangemeld(freelancerId as unknown as mongoose.Types.ObjectId);
                if (response) {
                  // Filter and separate shifts based on their status
                  const aangemeldShifts = response.filter((shift: { status: string; }) => shift.status !== 'aangenomen');
                  // Set the state with the filtered shifts
                  setAangemeld(aangemeldShifts);
                } else {
                  // If no response or not an array, default to empty arrays
                  setAangemeld([]);
                }
            
          } catch (error) {
            console.error('Error fetching shifts:', error);
          }
        };
        fetchAangemeldeShifts();  // Call the fetchShifts function
      }, [freelancerId]);

      useEffect(() => {
        const fetchSollicitaties = async () => {
          try {
            const response = await haalSollicitatiesFreelancer(freelancerId);
            setSollicitaties(response || []);
          } catch (error) {
            console.error('Error fetching sollicitaties:', error);
          }
        };
        
        fetchSollicitaties();
      }, [freelancerId]);

    return (
            <>
                <h1 className='mb-10 items-center justify-center text-4xl'> {dashboard.werknemersPage.Shifts.texts[0].headTitleShifts} </h1>
            <ScrollArea>
                {aangemeld.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {aangemeld.slice(0, aangemeld.length).map((shiftItem, index) => (
                <Card key={index} shift={shiftItem} lang={lang}/>
                ))}
                </div>
              ) : ( 
                <p className="text-center text-lg text-gray-500">{dashboard.werknemersPage.Shifts.texts[0].NoShifts}</p>
              )
              }
              </ScrollArea>

            
            <h1 className='mb-10 items-center justify-center text-4xl'> {dashboard.werknemersPage.Shifts.texts[0].headTitleVacatures} </h1>
           <ScrollArea> 
            {sollicitaties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sollicitaties.slice(0, sollicitaties.length).map((sollicitatiesItem, index) => (
            <ApplicationCard key={index} sollicitatie={sollicitatiesItem} lang={lang}/>
            ))}
            </div>
            ) : (
            <p className="text-center text-lg text-gray-500">{dashboard.werknemersPage.Shifts.texts[0].NoVacatures}</p>
             )
            }
             </ScrollArea>
             </>
    )
}