"use client"

import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import  edit  from "@/app/assets/images/edit.svg";
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { IShiftArray } from '@/app/lib/models/shiftArray.model';
import { ApplyConfirmation } from '@/app/[lang]/components/shared/ApplyConfirmation';
import { DeleteConfirmation } from '@/app/[lang]/components/shared/DeleteConfirmation';

type Props = {
  shift: IShiftArray;
  components: any;
  lang: Locale ;
};

const Card = ({ shift, components, lang }: Props) => {
  const { user } = useUser();
  const [isEenBedrijf, setIsEenBedrijf] = useState<boolean | undefined>(false);

  useEffect(() => {
    if (user) {
      // Check if user has organization memberships (indicating they're an employer)
      const userType = user?.organizationMemberships?.length ?? 0;
      setIsEenBedrijf(userType >= 1);
    }
  }, [user]);


  const backgroundImageUrl = shift.image;
  const opdrachtgeverName = shift.employerName || 'Junter';
  const opdrachtgeverStad = shift.adres || 'Amsterdam';
  const flexpoolTitle = shift.inFlexpool ? "✅ flexpool" : '❎ flexpool';


  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      { isEenBedrijf ? (
          <Link 
          href={`/${lang}/dashboard/shift/employer/${shift._id}`}
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
        />
      ):   <Link 
      href={`/${lang}/dashboard/shift/employee/${shift._id}`}
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
    />}
      {isEenBedrijf && shift.status === "beschikbaar" || shift.status === "container" ? (
        <div className="absolute items-stretch right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/${lang}/dashboard/shift/employer/${shift._id}/update`}>
            <Image src={edit} alt="edit" width={20} height={20} />
          </Link>
          <DeleteConfirmation shiftId={shift._id as string} lang={lang} dictionary={{ components }}/>
        </div>
      ) :
      (
          !isEenBedrijf && (
            <div className="absolute items-stretch right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <ApplyConfirmation shiftId={shift._id as string} lang={lang} dictionary={components}/>
        </div>
          )
      )}

      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        <div className="flex gap-2">
          <span className="p-semibold-14 w-min rounded-full line-clamp-1 bg-green-100 px-4 py-1 text-green-60">
            {components?.cards?.ShiftArrayCard?.currencySign || '€'}{shift.hourlyRate}
          </span>
          <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
            {shift.function}
          </p>
          <p className="text-sm md:p-medium-16 text-grey-600 line-clamp-1">
           {shift.accepted?.length || 0} / {shift.spots} 
          </p>
        </div>


        {
        shift.available && (
             <div className="flex-between w-full">
                <p className="p-medium-16 p-medium-18 text-grey-500">
                  {new Intl.DateTimeFormat(`${components?.cards?.ShiftArrayCard?.localDateString || 'en-US'}`, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(shift.startingDate))}
                </p>
                <p className="p-medium-16 p-medium-18 text-grey-500">
                  {shift.starting} - {shift.ending}
                </p>
            </div>
                  )
                }
        
        
        { isEenBedrijf ? (
          <Link href={`/${lang}/dashboard/shift/employer/${shift._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-1 flex-1 text-black">{shift.title}</p>
        </Link>
      ):   <Link href={`/${lang}/dashboard/shift/employee/${shift._id}`}>
      <p className="p-medium-16 md:p-medium-20 line-clamp-1 flex-1 text-black">{shift.title}</p>
    </Link>}
        <div className="flex-between w-full"></div>
        <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
          {opdrachtgeverStad}
          </p> 
          
        <div className="flex-between w-full">
          <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
            {opdrachtgeverName}
          </p> 
          {isEenBedrijf && shift.status === 'checkout ingevuld' ? (
             <p className="p-medium-14 md:p-medium-16 text-grey-600">
             {shift.status}
         </p>
          ) : (
            <p className="p-medium-14 md:p-medium-16 text-grey-600">
            {flexpoolTitle}
        </p>
          )
          }
        </div>
      </div>
    </div>
  );
};

export default Card;

