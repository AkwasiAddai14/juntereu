"use client"

import Link from 'next/link';
import React, { useState } from 'react';
import { ShiftType } from '@/app/lib/models/shift.model';
import { useToast } from '@/app/[lang]/components/ui/use-toast';
import { accepteerCheckout } from '@/app/lib/actions/checkout.actions';
import { useRouter } from 'next/navigation';
import { Locale } from '@/i18n.config'
import { getDictionary } from '@/app/[lang]/dictionaries'


type CheckoutCardClientProps = {
  shift: ShiftType;
  components: any;
};

export default function Card ({ shift, components }: CheckoutCardClientProps) {
  const { toast } = useToast();
  const router = useRouter();


  const backgroundImageUrl = shift.employeeProfilephoto;
  const opdrachtNemerNaam = `${shift.employeeFirstname} ${shift.employeeLastname}`;


  const handleCheckoutAcceptance = async (shiftId:string) => {
    try {
      const response = await accepteerCheckout(
        {
          shiftId: shiftId, 
          rating:  5, // Use default value if `undefined`
          feedback:  " ",
          laat: false,
        }
      )
      if (response.success) {
        toast({
          variant: 'succes',
          description: `${components.cards.CheckoutCard.ToastMessage1}`
        });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          description: `${components.cards.CheckoutCard.Toastmessage2}`
        });
      }
    } catch (error) {
      console.error('Failed to submit checkout:', error);
  } 
}

function berekenGewerkteUren(begintijd: string, eindtijd: string, pauzeMinuten: number = 0): number {
  const [beginUur, beginMinuut] = begintijd.split(':').map(Number);
  const [eindUur, eindMinuut] = eindtijd.split(':').map(Number);

  const beginInMinuten = beginUur * 60 + beginMinuut;
  const eindInMinuten = eindUur * 60 + eindMinuut;

  let totaalMinuten = eindInMinuten - beginInMinuten - pauzeMinuten;

  if (totaalMinuten < 0) {
    throw new Error("Eindtijd mag niet eerder zijn dan begintijd");
  }

  return Math.max(0, totaalMinuten / 60); // Afronding op uren
}
  

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link 
    href={`/dashboard/checkout/employer/${shift._id}`}
    style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />
          <p className="p-medium-16 md:p-medium-20 line-clamp-1 flex-1 text-black">{opdrachtNemerNaam}</p>
        
      <div className="flex min-h-[230px] flex-col gap-3 py-5 px-3 md:gap-4">
        <div className="flex gap-2">
          <span className="p-semibold-14 w-min rounded-full line-clamp-1 bg-green-100 px-4 py-1 text-green-60">
            {components.cards.CheckoutCard.currencySign}{shift.hourlyRate}
          </span>
          <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
            {shift.function}
          </p>
        </div>
         <p className="p-medium-16 p-medium-18 text-grey-500">
            {shift.title}
          </p> 
        <div className="flex-between w-full">
         <Link href={`/dashboard/shift/employer/${shift.shiftArrayId}`}> {/* /${lang} */}
          <p className="p-medium-16 p-medium-18 text-grey-500">
          {new Date(shift.startingDate).toLocaleDateString(`${components.cards.CheckoutCard.localDateString}`)}
          </p>
          </Link>
          <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-500">
          {shift.starting} - {shift.ending}
          </p> 
        </div>
        
        
        <div className="flex-between w-full">
          {components.cards.CheckoutCard.gewerkteUren}
          <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-500">
          {berekenGewerkteUren(shift.checkoutstarting, shift.checkoutending, shift.checkoutpauze as unknown as number)} ;
          </p> 
        </div>

        <div className="flex-between w-full">
          <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-300">
          {shift.checkoutstarting} - {shift.checkoutending}
          </p> 
          <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-300">
          {shift.checkoutpauze} {components.cards.CheckoutCard.minPauze}
          </p> 
        </div>

        <div className="flex-between w-full">
            <button onClick={() => router.push(`/dashboard/checkout/employer/${shift._id}`)} className="inline-flex ml-2 items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
              {components.cards.CheckoutCard.weigeren}
            </button>
            <button onClick={() => handleCheckoutAcceptance(shift._id)}
              className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {components.cards.CheckoutCard.accepteren}
            </button>
        </div>
      </div>
    </div>
  );
};


