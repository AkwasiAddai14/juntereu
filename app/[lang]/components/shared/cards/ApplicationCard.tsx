"use client"

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import  del  from "@/app/assets/images/delete.svg"
import { useToast } from '@/app/[lang]/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { IApplication } from '@/app/lib/models/application.model';
import { berekenBedragVanAlleDiensten, haalVacature, trekSollicitatieIn } from '@/app/lib/actions/vacancy.actions';

type CardProps = {
  sollicitatie: IApplication;
};

const Card = ({ sollicitatie }: CardProps) => {
  const { toast } = useToast();
  const [totaalbedrag, setTotaalBedrag] = useState<number | null>(0);
  const [vacature, setVacature] = useState<any>();
  const router = useRouter();


  useEffect(() => {
    const fetchVacature = async () => {
      try {
        const response = await haalVacature(sollicitatie.vacancy as unknown as string);
        setVacature(response || '');
      } catch (error) {
        console.error('Error fetching vacature:', error);
      }
    };
    
    fetchVacature();
  }, [sollicitatie.vacancy]); 


useEffect(() => {
const berekenBedragvanVacature = async (sollicitatieId:string) => {
    try {
        const response = await berekenBedragVanAlleDiensten( sollicitatieId );
        if (response) {
          setTotaalBedrag(response)
        } else {
         return (vacature.uurloon * sollicitatie.jobs.length * 5)
        }
      } catch (error: any) {
        toast({
          variant: 'destructive',
          description: `Actie is niet toegestaan! ${error.message} `
        });
      }
}; 
berekenBedragvanVacature(sollicitatie.id);
}, [sollicitatie]);


 const handleFreelanceRejection = async () => {
   try {
     const response = await trekSollicitatieIn(sollicitatie.id, sollicitatie.employer.toString());
 
     if (response.success) {
       toast({
         variant: 'succes',
         description: "Sollicitatie ingetrokkken! "
       });
       router.refresh();
     } else {
       // Handle non-success response
       toast({
         variant: 'destructive',
         description: `Actie is niet toegestaan! ${response.message}`
       });
     }
   } catch (error: any) {
     toast({
       variant: 'destructive',
       description: `Actie is niet toegestaan! ${error.message} `
     });
   }
 };

  const backgroundImageUrl = vacature.afbeelding;
  const opdrachtgeverName = vacature.opdrachtgeverNaam || 'Junter';
  let linkHref = `/dashboard/vacature/pagina/${sollicitatie.vacancy}`;
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



  

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      
      <Link 
    href={linkHref}
    style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />      
        <button onClick={() => sollicitatie.employer && handleFreelanceRejection()} className="absolute items-stretch right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
            <Image src={del} alt="delete" width={20} height={20} />
        </button>


      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        <div className="flex gap-2">
          <span className="p-semibold-14 w-min rounded-full line-clamp-1 bg-green-100 px-4 py-1 text-green-60">
            € {totaalbedrag}
          </span>
          <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
            {vacature.functie}
          </p>
        </div>

        <div className="flex-between w-full">
          <p className="p-medium-16 p-medium-18 text-grey-500">
          {new Date(vacature.begindatum).toLocaleDateString('nl-NL')}
          </p> 
          <p className="p-medium-16 p-medium-18 text-grey-500">
          {vacature.begintijd} - {vacature.eindtijd}
          </p>
        </div>
       
        
       
          <Link href={`/dashboard/vacature/pagina/${sollicitatie.vacancy}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-1 flex-1 text-black">{vacature.titel}</p>
        </Link>
      
        <div className="flex-between w-full">
          <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
            {opdrachtgeverName}
          </p> 
        </div>
        <div className="flex-between w-full">
            <p className="p-medium-14 md:p-medium-16 text-grey-600">Flexwerk</p>
       <div className={`rounded-md px-4 py-2 ${getStatusColor(status)}`}> 
        <Link href={linkHref}>
        <p className="line-clamp-1 p-medium-14 md:p-medium-16 text-grey-600">
        {sollicitatie.jobs.length} diensten
        </p>
        </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;