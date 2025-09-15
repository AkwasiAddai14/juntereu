"use client"

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import  del  from "@/app/assets/images/delete.svg"
import { useToast } from '@/app/[lang]/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { IJob } from '@/app/lib/models/job.model';
import { haalVacature, verwijderDienst } from '@/app/lib/actions/vacancy.actions';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';

type Props = {
  dienst: IJob;
  components: any;
};

const Card = async ({ dienst, components }: Props) => {
  const { toast } = useToast();
  const [vacature, setVacature] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    const fetchVacature = async () => {
      try {
        const response = await haalVacature(dienst.vacancy as unknown as string);
        setVacature(response || '');
      } catch (error) {
        console.error('Error fetching vacature:', error);
      }
    };
    
    fetchVacature();
  }, [dienst.vacancy]); 



const backgroundImageUrl = vacature.afbeelding;
const opdrachtgeverName = vacature.opdrachtgeverNaam || 'Junter';
let linkHref = `/dashboard/vacature/pagina/${dienst.vacancy}`;
let status = vacature.beschikbaar;

const getStatusColor = (status: boolean) => {
    switch (status) {
      case true:
        return 'bg-green-500'; // Green background for 'aangenomen' and 'afgerond'
      case false:
        return 'bg-red-500'
      default:
        return 'bg-blue-400'; // Default background if no status matches
    }
  };



  const handleFreelanceRejection = async () => {
    try {
      const response = await verwijderDienst(dienst.id);
  
      if (response.success) {
        toast({
          variant: 'succes',
          description: `${components.cards.JobCard.ToastMessage1}`
        });
        router.refresh();
      } else {
        // Handle non-success response
        toast({
          variant: 'destructive',
          description: `${components.cards.JobCard.Toastmessage2} ${response.message}`
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: `${components.cards.JobCard.Toastmessage2} ${error.message} `
      });
    }
  };
  

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      
      <Link 
    href={linkHref}
    style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />


   
        <button onClick={() => dienst.employees && handleFreelanceRejection()} className="absolute items-stretch right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
            <Image src={del} alt="delete" width={20} height={20} />
        </button>


      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        <div className="flex gap-2">
          <span className="p-semibold-14 w-min rounded-full line-clamp-1 bg-green-100 px-4 py-1 text-green-60">
            {opdrachtgeverName}
          </span>
          <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
            {vacature.functie}
          </p>
        </div>

        <div className="flex-between w-full">
          <p className="p-medium-16 p-medium-18 text-grey-500">
          {new Date(dienst.date).toLocaleDateString(`${components.cards.JobCard.localDateString}`)}
          </p> 
          <p className="p-medium-16 p-medium-18 text-grey-500">
          {dienst.workingtime.starting} - {dienst.workingtime.ending}
          </p>
          <p className="p-medium-16 p-medium-18 text-grey-500">
          {dienst.workingtime.break} {components.cards.JobCard.pauze}
          </p>
        </div>
       
        
        <div className="flex-between w-full">


          <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
          {components.cards.JobCard.currencySign}{dienst.amount} 
          </p> 


          <div className={`rounded-md px-4 py-2 ${getStatusColor(status)}`}>
        <Link href={linkHref}>
        <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
        {vacature.titel}
        </p>
        </Link>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Card;