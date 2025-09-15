'use client'

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/app/[lang]/components/ui/scroll-area";
import FactuurCard from '@/app/[lang]/components/shared/cards/Wrappers/InvoiceWrappers'; 
import { haalFacturenFreelancer } from "@/app/lib/actions/invoice.actions";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  lang: Locale;
  dashboard: any;
};

export default async function Financien ({ lang, dashboard }: Props) {
  const { isLoaded, user } = useUser();
  const [factuur, setFactuur] = useState<any[]>([]);
  const [freelancerId, setFreelancerId] = useState<any>(null);


  useEffect(() => {
    if (isLoaded && user) {
      setFreelancerId(user?.id)
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchFactuur = async () => {
      try {
        const response = await haalFacturenFreelancer(freelancerId);
        setFactuur(response || []);
      } catch (error) {
        console.error('Error fetching factuur:', error);
      }
    };
    
    fetchFactuur();
  }, [freelancerId]); 

    return (
      <>
      <h1 className='mb-10 items-center justify-center text-4xl'> {dashboard.werknemersPage.Financien.Loonstroken} </h1>
      <ScrollArea>
              {factuur.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {factuur.slice(0, factuur.length).map((factuurItem, index) => (
                  <FactuurCard key={index} factuur={factuurItem} lang={lang}/>
                  ))}
                  </div>
                ) : ( 
                  <div>
                 {dashboard.werknemersPage.Financien.noPyaslips}
                </div> 
                )
              } 
         </ScrollArea>
         </>      
    )
}
