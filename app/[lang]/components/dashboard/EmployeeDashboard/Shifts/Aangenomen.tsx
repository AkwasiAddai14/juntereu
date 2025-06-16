'use client'

import * as React from "react";
import mongoose from "mongoose";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import JobCard from "@/app/[lang]/components/shared/cards/JobCard";
import { haalAangemeld } from "@/app/lib/actions/shift.actions"
import Card from '@/app/[lang]/components/shared/cards/ShiftCard';
import { ScrollArea } from "@/app/[lang]/components/ui/scroll-area";
import { haalDienstenFreelancer } from "@/app/lib/actions/vacancy.actions";
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';

export default async function Aangenomen ({ lang }: { lang: Locale }) {
    const { isLoaded, user } = useUser();
    const [freelancerId, setFreelancerId] = useState<any>(null);
    const [geaccepteerd, setGeaccepteerd] = useState<any[]>([]);
    const [diensten, setDiensten] = useState<any[]>([]);
    const { dashboard } = await getDictionary(lang);

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
                  const geaccepteerdShifts = response.filter((shift: { status: string; }) => shift.status === 'aangenomen');
                  // Set the state with the filtered shifts
                  setGeaccepteerd(geaccepteerdShifts);
                } else {
                  // If no response or not an array, default to empty arrays
                  setGeaccepteerd([]);
                }
          } catch (error) {
            console.error('Error fetching shifts:', error);
          }
        };
        fetchAangemeldeShifts();  // Call the fetchShifts function
      }, [freelancerId]); 

      useEffect(() => {
        const fetchDiensten = async () => {
          try {
            const response = await haalDienstenFreelancer(freelancerId);
            setDiensten(response || []);
          } catch (error) {
            console.error('Error fetching factuur:', error);
          }
        };
        
        fetchDiensten();
      }, [freelancerId]);

    return (
        <>
        <h1 className='mb-10 items-center justify-center text-4xl'> {dashboard.werknemersPage.Shifts.texts[1].headTitleShifts} </h1>
        <ScrollArea>

        {geaccepteerd.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {geaccepteerd.slice(0, geaccepteerd.length).map((shiftItem, index) => (
              <Card key={index} shift={shiftItem} lang={lang}/>
              ))}
              </div>
            ) : ( 
              <div>{dashboard.werknemersPage.Shifts.texts[1].NoShifts}</div>
                )
        }
              </ScrollArea>


        <h1 className='mb-10 items-center justify-center text-4xl'> {dashboard.werknemersPage.Shifts.texts[1].headTitleVacatures} </h1>
        <ScrollArea>
    {diensten.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {diensten.slice(0, diensten.length).map((dienstenItem, index) => (
            <JobCard key={index} dienst={dienstenItem} lang={lang}/>
             ))}
            </div>
          ) : (
                    <p className="text-center text-lg text-gray-500">{dashboard.werknemersPage.Shifts.texts[1].NoVacatures}</p>
        )} 
        </ScrollArea>
        </>  
    )
}