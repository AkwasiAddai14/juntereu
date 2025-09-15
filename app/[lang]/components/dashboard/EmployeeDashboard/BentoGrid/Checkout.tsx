'use client'

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { haalDienstenFreelancer } from "@/app/lib/actions/vacancy.actions";
import { haalCheckouts, haalCheckoutsMetClerkId } from "@/app/lib/actions/checkout.actions";
import forkliftDriver from '@/app/assets/images/iStock-1308572401.jpg';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

interface CheckoutClientProps {
  dashboard: any;
}
  
  export default function Checkout({ dashboard }: CheckoutClientProps) {
    const { isLoaded, user } = useUser();
    const [freelancerId, setFreelancerId] = useState<any>(null);
    const [checkout, setCheckout] = useState<any[]>([]);
    const [diensten, setDiensten] = useState<any[]>([]);


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
  
    const directory = {
      checkouts: checkout,
      diensten: diensten
    };

    if(checkout.length === 0 && diensten.length === 0){
      return (
        <div className="flex h-full items-center justify-center text-gray-400 text-center">
          {dashboard.werknemersPage.BentoGrid.Checkouts.zeroFoundText}
        </div>
      )
    }

    return (
      <nav aria-label="Directory" className="h-full overflow-y-auto">
        {Object.entries(directory).map(([type, items]) => (
          <div key={type} className="relative">
            <div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-50 px-3 py-1.5 text-sm/6 font-semibold text-gray-900">
              <h3>{type}</h3>
            </div>
            <ul role="list" className="divide-y divide-gray-100">
            {items.map((item, index) => (
                <li key={index} className="flex gap-x-4 px-3 py-5">
                  <img alt="" src={item.image || forkliftDriver} className="size-12 flex-none rounded-full bg-gray-50" />
                  <div className="min-w-0">
                    <p className="text-sm/6 font-semibold text-gray-900">{item.startingDate ? item.startingDate : item.date}</p>
                    <p className="mt-1 truncate text-xs/5 text-gray-500">{item.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    )
  }
  