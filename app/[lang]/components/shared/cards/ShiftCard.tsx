"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n.config';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import  del  from "@/app/assets/images/delete.svg";
import { ShiftType } from '@/app/lib/models/shift.model';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/app/[lang]/components/ui/use-toast';
import { annuleerAanmeldingen } from '@/app/lib/actions/shift.actions';

type Props = {
  shift: ShiftType;
  lang: string;
  components: any;
};

const Card = ({ shift, lang, components }: Props) => {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isEenBedrijf, setIsEenBedrijf] = useState<boolean | null>(null);
  const shiftStatussen = components.cards.ShiftCard.shift_statussen;

  useEffect(() => {
    if (user) {
      // Check if user has organization memberships (indicating they're an employer)
      const userType = user?.organizationMemberships?.length ?? 0;
      setIsEenBedrijf(userType >= 1);
    }
  }, [user]);

  const backgroundImageUrl = shift.image;
  const opdrachtgeverName = shift.employerName || 'Junter';
  const flexpoolTitle = shift.inFlexpool ? "✅ flexpool" : '❎ flexpool';
  const opdrachtnemerId = typeof shift.employee === 'string' ? shift.employer : shift.employee?.toString();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case shiftStatussen[2]: // 'geaccepteerd'
      case 'afgerond':
        return 'bg-green-500';
      case shiftStatussen[5]: // 'checkout indienen'
        return 'bg-yellow-400';
      case shiftStatussen[3]: // 'chekout geweigerd'
        return 'bg-red-500';
      case shiftStatussen[6]: // 'afgewezen'
      case 'afgezegd':
      case 'no show':
        return 'bg-red-500';
      default:
        return 'bg-blue-400';
    }
  };

  const shiftArrayId = shift.shiftArrayId;

  const handleFreelanceRejection = async (freelancerId: string) => {
    try {
      const response = await annuleerAanmeldingen({ shiftArrayId, freelancerId });
  
      if (response.success) {
        toast({
          variant: 'succes',
          description: `${components.cards.ShiftCard.ToastMessage1}`
        });
      } else {
        // Handle non-success response
        toast({
          variant: 'destructive',
          description: `${components.cards.ShiftCard.Toastmessage2} ${response.message}`
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: `${components.cards.ShiftCard.Toastmessage2} ${error.message} `
      });
    }
  };
  let linkHref;

  if (isEenBedrijf) {
    linkHref = `/dashboard/shift/employer/${shift.shiftArrayId}`;
  } else if (shift.status === 'voltooi checkout' || shift.status === 'Checkout geweigerd') {
    linkHref = `/dashboard/checkout/employee/${shift._id}`;
  } else {
    linkHref = `/dashboard/shift/employee/${shift.shiftArrayId}`;
  }
  

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      
      <Link 
    href={linkHref}
    style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />


      {!isEenBedrijf && (shift.status === "aangenomen" || shift.status === "aangemeld" || shift.status === 'reserve') && (
        <button onClick={() => opdrachtnemerId && handleFreelanceRejection(opdrachtnemerId.toString())} className="absolute items-stretch right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
            <Image src={del} alt="delete" width={20} height={20} />
        </button>
      )}

      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        <div className="flex gap-2">
          <span className="p-semibold-14 w-min rounded-full line-clamp-1 bg-green-100 px-4 py-1 text-green-60">
            {components.cards.ShiftCard.currencySign}{shift.hourlyRate}
          </span>
          <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
            {shift.function}
          </p>
        </div>

        <div className="flex-between w-full">
          <p className="p-medium-16 p-medium-18 text-grey-500">
          {new Date(shift.startingDate).toLocaleDateString(`${components.cards.ShiftCard.localDateString}`)}
          </p> 
          <p className="p-medium-16 p-medium-18 text-grey-500">
          {shift.starting} - {shift.ending}
          </p>
        </div>
       
        
        { isEenBedrijf  ? (
          <Link href={`/${lang}/dashboard/shift/employer/${shift.shiftArrayId}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-1 flex-1 text-black">{shift.title}</p>
        </Link>
      ):   <Link href={`/${lang}/dashboard/shift/employee/${shift.shiftArrayId}`}>
      <p className="p-medium-16 md:p-medium-20 line-clamp-1 flex-1 text-black">{shift.title}</p>
    </Link>}
        <div className="flex-between w-full">
          <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
            {opdrachtgeverName}
          </p> 
        </div>
                  <div className="flex-between w-full">
                    { shift.status === 'afgerond' && shift.totaalAmount ? 
                      <p className="p-medium-14 md:p-medium-16 text-grey-600">{components.cards.ShiftCard.currencySign}{shift.totaalAmount}</p>
                      :
                      <p className="p-medium-14 md:p-medium-16 text-grey-600">{flexpoolTitle}</p>
                    }{/* //<p className="p-medium-14 md:p-medium-16 text-grey-600">{flexpoolTitle}</p> */}
                 <div className={`rounded-md px-4 py-2 ${getStatusColor(shift.status)}`}>
                  {shift.status === 'voltooi checkout' || shift.status === 'Checkout geweigerd' ? 
                  <Link href={`/${lang}/dashboard/checkout/employee/${shift.shiftArrayId}`}>
                  <p className="p-medium-14 md:p-medium-16 text-grey-600">
                  {shift.status === 'Checkout geweigerd' 
              ? shiftStatussen[3] 
                : shift.status === 'voltooi checkout' 
                  ? shiftStatussen[5] 
                  : shift.status}
                    </p>
                  </Link> :
                  <Link href={linkHref}>
                  <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
                  {shift.status === 'Checkout geweigerd' 
              ? shiftStatussen[3] 
              : shift.status === 'checkout geaccepteerd' 
                ? shiftStatussen[4] 
                : shift.status === 'voltooi checkout' 
                  ? shiftStatussen[5] 
                  : shift.status}
                  </p>
                  </Link>
                  }  
                    </div>
                  </div>
      </div>
    </div>
  );
};

export default Card;

