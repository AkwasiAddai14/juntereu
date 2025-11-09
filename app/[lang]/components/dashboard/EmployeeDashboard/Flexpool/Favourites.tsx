'use client';

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/app/[lang]/components/ui/scroll-area";
import { haalFlexpoolFreelancer } from "@/app/lib/actions/flexpool.actions";
import FlexpoolCard from "@/app/[lang]/components/shared/cards/Wrappers/FlexpoolWrapper";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

type Props = {
  lang: Locale;
  dashboard: any;
};

const page = ({ lang, dashboard }: Props) => {
  const { isLoaded, user } = useUser();
  const [flexpool, setFlexpool] = useState<any[]>([]);
  const [freelancerId, setFreelancerId] = useState<any>(null);
  

  useEffect(() => {
    if (isLoaded && user) {
      setFreelancerId(user?.id)
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchFlexpool = async () => {
      try {        
        const flexpools = await haalFlexpoolFreelancer(freelancerId || user?.id as string);
        setFlexpool(flexpools || []);
      } catch (error){
        console.log('Error fetching flexpools:', error);
        setFlexpool([]);
        }
    }
      fetchFlexpool();
    }, [freelancerId]);


  return ( 
               <>
                <h1 className='mb-10 items-center justify-center text-4xl'> {dashboard.werknemersPage.Flexpool.Favorieten.headTitle} </h1>
            <ScrollArea>
              {flexpool.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {flexpool.slice(0, flexpool.length).map((flexpoolItem, index) => (
                  <FlexpoolCard key={index} flexpool={flexpoolItem} lang={lang} components={dashboard?.components || {}}/>
                  ))}
                  </div>
              ) : ( 
                  <p className="text-center text-lg text-gray-500">{dashboard.werknemersPage.Flexpool.Favorieten.noFavorieten}</p>
              )
                } 
            </ScrollArea>
                </>
  )
}

export default page