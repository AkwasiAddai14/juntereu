'use client'

import * as React from "react";
import mongoose from "mongoose";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { IVacancy } from '@/app/lib/models/vacancy.model';
import { haalFreelancer } from "@/app/lib/actions/employee.actions"
import { ScrollArea } from "@/app/[lang]/components/ui/scroll-area";
import { haalRelevanteVacatures} from "@/app/lib/actions/vacancy.actions";
import VacancyCard from "@/app/[lang]/components/shared/cards/Wrappers/VacancyWrapper";
import type { Locale } from '@/app/[lang]/dictionaries';
import SharedFilters from "./SharedFilters";

interface Props {
  lang: Locale;
  dashboard: any;
}


export default function Vacancy ({ lang, dashboard }: Props) {
    const { isLoaded, user } = useUser();
    const [freelancerId, setFreelancerId] = useState<any>(null);
    const [vacatures, setVacatures] = useState<IVacancy[]>([]);

    useEffect(() => {
        if (isLoaded && user) {
          setFreelancerId(user?.id)
        }
      }, [isLoaded, user]);
    
      useEffect(() => {
        const getFreelancerId = async () => {
          try {
            const freelancer = await haalFreelancer(user!.id);
          } catch (error) {
            console.error("Error fetching freelancer by Clerk ID:", error);
          }
        };
      
        if (user && !freelancerId) {  // Only fetch if user exists and freelancerId is not already set
          getFreelancerId();
        }
      }, [freelancerId]);

    useEffect(() => {
  
        const fetchVacatures = async () => {
          try {
            const vacatures = await haalRelevanteVacatures(freelancerId as unknown as mongoose.Types.ObjectId);
            setVacatures(vacatures || []);
            if (vacatures) {
              // Sort the shifts by date
              
              const sortedVacatures = vacatures.sort((a: any, b: any) => {
                return new Date(a.begindatum).getTime() - new Date(b.begindatum).getTime(); // Ascending order
              });
              console.log(sortedVacatures)
              setVacatures(sortedVacatures); // Set the sorted vacatures
            } else {
              setVacatures([]); // Handle case where vacatures is empty or null
            }
          } catch (error) {
            console.error('Error fetching vacature:', error);
            setVacatures([]);
          }
        };
        fetchVacatures();
      
    }, [freelancerId]); 

    return (
      <div className="flex gap-6">
        {/* Left Sidebar - Filters */}
        <div className="w-80 flex-shrink-0">
          <SharedFilters dashboard={dashboard} />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1">
          <h1 className='mb-10 items-center justify-center text-4xl'>{dashboard?.werknemersPage?.Explore?.VacaturePagina?.headTitle || 'Vacancies'}</h1>
          <ScrollArea>
            {vacatures.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {vacatures.slice(0, vacatures.length).map((vacaturesItem, index) => (
                  <VacancyCard key={index} vacature={vacaturesItem} lang={lang} components={dashboard?.components || {}}/>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-gray-500 text-lg">
                  {dashboard?.werknemersPage?.Explore?.VacaturePagina?.NoVacatures || 'No vacancies available'}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    )
}