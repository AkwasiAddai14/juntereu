"use client"

import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { IJob } from '@/app/lib/models/job.model';
import React, { useEffect, useState } from 'react';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { IVacancy } from '@/app/lib/models/vacancy.model';
import { useUser } from '@clerk/nextjs';
import { haalBijbehorendeDiensten } from '@/app/lib/actions/vacancy.actions';
import { VacancyDeleteConfirmation } from '@/app/[lang]/components/shared/VacancyDeleteConfirmation';

type Props = {
  vacature: IVacancy;
  lang: Locale;
  components: any;
};

const Card = ({ vacature, lang, components }: Props) => {
  const { user } = useUser();
  const [isEenBedrijf, setIsEenBedrijf] = useState<boolean | undefined>(false);
  const [diensten, setDiensten] = useState<IJob[]>([]);

  useEffect(() => {
    if (vacature && vacature._id) {  // Only fetch shifts if vacatureId is available
      const fetchDiensten = async () => {
        try {
          const diensten = await haalBijbehorendeDiensten({ vacatureId: vacature._id!.toString() });
          setDiensten(diensten || []);  // Ensure diensten is always an array
        } catch (error) {
          console.error('Error fetching diensten:', error);
          setDiensten([]);  // Handle error by setting an empty array
        }
      };
      fetchDiensten();
    }
  }, [vacature.id]);

  useEffect(() => {
    if (user) {
      // Check if user has organization memberships (indicating they're an employer)
      const userType = user?.organizationMemberships?.length ?? 0;
      setIsEenBedrijf(userType >= 1);
    }
  }, [user]);

  const calculateTotalBedrag = (diensten: IJob[]): number => {
    return diensten.reduce((total, dienst) => total + (dienst.amount || 0), 0);
  };
  const backgroundImageUrl = vacature.image;
  const totaalbedrag = calculateTotalBedrag(diensten);
    
  


  return (
    <div className="group relative flex w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <Link href={`/${lang}/dashboard/vacancies/${vacature._id}`} className="block h-full w-full">
      {/* Image Section */}
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={backgroundImageUrl || '/placeholder-image.svg'}
          alt={vacature.title || 'Vacancy Image'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.src = '/placeholder-image.svg';
          }}
        />
        
        {/* Delete Button for Employers */}
        {isEenBedrijf && (
          <div className="absolute items-stretch right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
            <VacancyDeleteConfirmation vacancyId={vacature._id as string} lang={lang} dictionary={{ components }}/>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 space-y-3">
        {/* Top Row - Rate, Category, and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full bg-green-100 px-2.5 py-1">
              <span className="text-green-800 font-semibold text-sm">
                {components?.cards?.VacancyCard?.currencySign || '€'}{vacature.hourlyRate}
              </span>
            </div>
            <span className="text-sm text-gray-600 truncate">
              {vacature.function}
            </span>
          </div>
          {/* <div className="text-sm text-gray-500">
            {vacature.applications?.length || 0} {components?.cards?.VacancyCard?.applicants || 'applicants'}
          </div> */}
        </div>

        {/* Date */}
        <div className='flex items-center justify-between'>
        <div className="text-sm text-gray-600">
          {new Intl.DateTimeFormat(`${components?.cards?.VacancyCard?.localDateString || 'en-US'}`, { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
          }).format(new Date(vacature.startingDate))}
        </div>

        {/* Time Range */}
        <div className="text-sm text-gray-600">
          {vacature.times[0].starting || '08:00'} - {vacature.times[0].ending || '16:30'}
        </div>
        </div>

        {/* Job Title */}
        <div className="text-base font-medium text-gray-900">
          {vacature.title}
        </div>

        {/* Location */}
        <div className="text-sm text-gray-600">
          {vacature.adres?.street} {vacature.adres?.housenumber}
        </div>

        {/* Employer Name */}
        {
          !isEenBedrijf && 
           <div className="text-sm text-gray-600">
          {vacature.employerName}
        </div>
        }
       

        {/* Flexpool Status */}
        {vacature.applications && (
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-gray-500">
            {vacature.applications?.length || 0} {components?.cards?.VacancyCard?.applicants || 'applicants'}
          </div>
          </div>
        )}
      </div>
      </Link>
    </div>
  );
};

export default Card;