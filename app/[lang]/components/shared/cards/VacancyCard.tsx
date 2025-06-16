"use client"

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { DeleteConfirmation } from '@/app/[lang]/components/shared/DeleteConfirmation';
import { IVacancy } from '@/app/lib/models/vacancy.model';
import { isBedrijf } from '@/app/lib/actions/employer.actions';
import { IJob } from '@/app/lib/models/job.model';
import { haalBijbehorendeDiensten } from '@/app/lib/actions/vacancy.actions';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';

type CardProps = {
  vacature: IVacancy;
};

const Card = async ({ vacature, lang }: CardProps & { lang: Locale }) => {
  const { components } = await getDictionary(lang);
  const [isEenBedrijf, setIsEenBedrijf] = useState<boolean | undefined>(false);
  const [diensten, setDiensten] = useState<IJob[]>([]);

  useEffect(() => {
    if (vacature && vacature.id) {  // Only fetch shifts if bedrijfId is available
      const fetchDiensten = async () => {
        try {
          const diensten = await haalBijbehorendeDiensten({ vacatureId: vacature.id });
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
    const bedrijfCheck = async () => {
      try {
        const isEventCreator = await isBedrijf();
        setIsEenBedrijf(isEventCreator);
      } catch (error) {
        console.error("Error checking if user is a bedrijf:", error);
      }
    };
  
    bedrijfCheck();
  }, []);

  const calculateTotalBedrag = (diensten: IJob[]): number => {
    return diensten.reduce((total, dienst) => total + (dienst.amount || 0), 0);
  };
  const backgroundImageUrl = vacature.image;
  const totaalbedrag = calculateTotalBedrag(diensten);
    
  


  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
        <Link 
      href={`/dashboard/vacture/${vacature._id}`}
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
    />

      {isEenBedrijf && (
        <div className="absolute items-stretch right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <DeleteConfirmation shiftId={vacature._id as string} lang={lang}/>
        </div>
      ) 
}

      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        <div className="flex gap-2">
            { isEenBedrijf ?  (
                 <span className="p-semibold-14 w-min rounded-full line-clamp-1 bg-green-100 px-4 py-1 text-green-60">
                 {components.cards.VacancyCard.currencySign}{vacature.hourlyRate}
               </span>
            ) : (
                <span className="p-semibold-14 w-min rounded-full line-clamp-1 bg-green-100 px-4 py-1 text-green-60">
                {components.cards.VacancyCard.currencySign}{totaalbedrag} {components.cards.VacancyCard.voor} {vacature.jobs?.length || 0} {components.cards.VacancyCard.hvl_shifts} 
              </span>
            )
        }
          <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
            {vacature.function}
          </p> 
          
          {
            isEenBedrijf && (
                <p className="text-sm md:p-medium-16 text-grey-600 line-clamp-1">
                {vacature.jobs?.length || 0} {components.cards.VacancyCard.hvl_shifts} 
               </p>
            )
          }
          <p className="text-sm md:p-medium-16 text-grey-600 line-clamp-1">
           {vacature.applications?.length || 0} {components.cards.VacancyCard.hvl_sollicitaties} 
          </p>
        </div>


        {
        vacature.available && (
             <div className="flex-between w-full">
                <p className="p-medium-16 p-medium-18 text-grey-500">
                  {new Intl.DateTimeFormat(`${components.cards.VacancyCard.localDateString}`, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(vacature.startingDate))} {components.cards.VacancyCard.tot} 
                </p>
                <p className="p-medium-16 p-medium-18 text-grey-500">
                {new Intl.DateTimeFormat(`${components.cards.VacancyCard.localDateString}`, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(vacature.endingDate))}
                </p>
            </div>
                  )
                }
          
        
          <Link href={`/dashboard/vacture/${vacature._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-1 flex-1 text-black">{vacature.title}</p>
        </Link>
      

        <div className="flex-between w-full"></div>
        <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
          {vacature.adres.street} {vacature.adres.housenumber}
          {vacature.adres.postcode} {vacature.adres.city}
          </p> 
          
          {!isEenBedrijf && (
               <div className="flex-between w-full">
               {vacature.dresscode?.length === 1 ? (
                    <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
                   {vacature.dresscode.length} {components.cards.VacancyCard.kledingvoorschriften[0]}
                   </p>
               ) : (
                   <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
                   {vacature.dresscode?.length || 0} {components.cards.VacancyCard.kledingvoorschriften[1]}
                   </p>
               )}
              
              {vacature.dresscode?.length === 1 ? (
                    <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
                   {vacature.skills?.length} {components.cards.VacancyCard.vaardigeheden[0]}
                   </p>
               ) : (
                   <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
                   {vacature.skills?.length || 0} {components.cards.VacancyCard.vaardigeheden[1]}
                   </p>
               )}
           </div>
          )}
     
      </div>
    </div>
  );
};

export default Card;