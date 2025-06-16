'use client'

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { haalDienstenFreelancer } from "@/app/lib/actions/vacancy.actions";
import JobCard from "@/app/[lang]/components/shared/cards/JobCard";
import Card from '@/app/[lang]/components/shared/cards/ShiftCard';
import { ScrollArea } from "@/app/[lang]/components/ui/scroll-area";
import { haalCheckouts, haalCheckoutsMetClerkId } from "@/app/lib/actions/checkout.actions";
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';

export default async function Afgerond ({ lang }: { lang: Locale }) {
  const { isLoaded, user } = useUser();
  const [freelancerId, setFreelancerId] = useState<any>(null);
  const [checkout, setCheckout] = useState<any[]>([]);
  const [ diensten, setDiensten] = useState<any[]>([]);
  const { dashboard } = await getDictionary(lang);

  useEffect(() => {
    if (isLoaded && user) {
      setFreelancerId(user?.id)
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        if(freelancerId !== ""){
          const response = await haalCheckouts(freelancerId);
          setCheckout(response);
        } else {
          if(user && user.id){
            const response = await haalCheckoutsMetClerkId(user.id);
            setCheckout(response ?? []);
          }
        }
      } catch (error) {
        console.error('Error fetching checkouts:', error);
      }
    };
    fetchCheckout();
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
            <h1 className='mb-10 items-center justify-center text-4xl'> {dashboard.werknemersPage.Shifts.texts[2].headTitleShifts} </h1>
                <ScrollArea>
              {checkout.length > 0 ?  (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {checkout.slice(0, checkout.length).map((checkoutItem, index) => (
                  <Card key={index} shift={checkoutItem} lang={lang}/>
                  ))}
                  </div>
                ) : ( 
                <div>{dashboard.werknemersPage.Shifts.texts[2].NoShifts}</div>
                )
                  }
                </ScrollArea>
                             
                            
                <h1 className='mb-10 items-center justify-center text-4xl'> {dashboard.werknemersPage.Shifts.texts[2].headTitleVacatures} </h1>
                  <ScrollArea>
                    {diensten.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {diensten.slice(0, diensten.length).map((dienstenItem, index) => (
                          <JobCard key={index} dienst={dienstenItem} lang={lang}/>
                        ))}
                      </div>
                      ) : (
                  <p className="text-center text-lg text-gray-500">{dashboard.werknemersPage.Shifts.texts[2].NoVacatures}</p>
                    )
                    }
                  </ScrollArea>
      </>
    )
}