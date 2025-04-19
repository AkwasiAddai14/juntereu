'use client'

import * as React from "react";
import mongoose from "mongoose";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import { AcademicCapIcon, BanknotesIcon, CheckBadgeIcon, ClockIcon, ReceiptRefundIcon, UsersIcon } from '@heroicons/react/24/outline'
import { IVacancy } from "@/app/lib/models/vacancy.model";
import { haalFlexpoolFreelancer } from "@/app/lib/actions/flexpool.actions";
import { haalFacturenFreelancer } from "@/app/lib/actions/invoice.actions";
import { haalAangemeld } from "@/app/lib/actions/shift.actions";
import { haalSollicitatiesFreelancer, haalDienstenFreelancer } from "@/app/lib/actions/vacancy.actions";
  

  
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }
  
  export default function Dashboard() {
    const { isLoaded, user } = useUser();
    const [freelancerId, setFreelancerId] = useState<any>(null);
    const [geaccepteerd, setGeaccepteerd] = useState<any[]>([]);
    const [diensten, setDiensten] = useState<any[]>([]);
    const [aangemeld, setAangemeld] = useState<any[]>([]);
    const [sollicitaties, setSollicitaties] = useState <any[]>([]);
    const [flexpool, setFlexpool] = useState<any[]>([]);
    const [factuur, setFactuur] = useState<any[]>([]);

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

      const statistics = [
        {
          length: aangemeld.length,
          title: 'Aanmeldingen',
          href: '#',
          icon: ClockIcon,
          iconForeground: 'text-teal-700',
          iconBackground: 'bg-teal-50',
        },
        {
          length: sollicitaties.length,
          title: 'Sollicitaties',
          href: '#',
          icon: CheckBadgeIcon,
          iconForeground: 'text-purple-700',
          iconBackground: 'bg-purple-50',
        },
        {
          length: geaccepteerd.length,
          title: 'Shifts',
          href: '#',
          icon: AcademicCapIcon,
          iconForeground: 'text-sky-700',
          iconBackground: 'bg-sky-50',
        },
        {
          length: diensten.length,
          title: 'Diensten',
          href: '#',
          icon: ReceiptRefundIcon,
          iconForeground: 'text-rose-700',
          iconBackground: 'bg-rose-50',
        },
        {
          length: flexpool.length,
          title: 'Flexpool',
          href: '#',
          icon: UsersIcon ,
          iconForeground: 'text-indigo-700',
          iconBackground: 'bg-indigo-50',
        },
        {
          length: factuur.length,
          title: 'Facturen',
          href: '#',
          icon: BanknotesIcon,
          iconForeground: 'text-yellow-700',
          iconBackground: 'bg-yellow-50',
        },
      ]

    return (
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
        {statistics.map((statistic, statisticIdx) => (
          <div
            key={statistic.title}
            className={classNames(
              statisticIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
              statisticIdx === 1 ? 'sm:rounded-tr-lg' : '',
              statisticIdx === statistics.length - 2 ? 'sm:rounded-bl-lg' : '',
              statisticIdx === statistics.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
              'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500',
            )}
          >
            <div>
              <span
                className={classNames(
                  statistic.iconBackground,
                  statistic.iconForeground,
                  'inline-flex rounded-lg p-3 ring-4 ring-white',
                )}
              >
                <statistic.icon aria-hidden="true" className="size-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-base font-semibold text-gray-900">
                <a href={statistic.href} className="focus:outline-none">
                  {/* Extend touch target to entire panel */}
                  <span aria-hidden="true" className="absolute inset-0" />
                  {statistic.length} {statistic.title}
                </a>
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et
                quo et molestiae.
              </p>
            </div>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
            >
              <svg fill="currentColor" viewBox="0 0 24 24" className="size-6">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </div>
        ))}
      </div>
    )
  }
  