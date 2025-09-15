"use client"

import { Fragment, useState } from "react";
import { format, parse } from 'date-fns';
import { useToast } from '../ui/use-toast';
import Image from 'next/image';
import SollicitatieModal from "@/app/[lang]/components/shared/Wrappers/SollicitatieModal";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


interface SollicitatiePageProps {
  sollicitaties: any[];
  lang: Locale;
  components: {
    shared: {
      Sollicitaties: {
        headTitle: string;
        subTitle: string;
        fieldValues: string[];
        attributes: string[];
      };
    };
  };
}


export const Sollicitaties = ({ sollicitaties, lang, components }: SollicitatiePageProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>();
  const [id, setId] = useState<string>('');
  const { toast } = useToast();
  
  
  const parseShiftTime = (date: Date): Date => {
    // Format the date to 'yyyy-MM-dd'
    const datePart = format(date, 'MM-dd-yyyy');
    // Combine the date part with the time
 
    const parsedDate = parse(datePart, 'MM-dd-yyyy', new Date());

    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date: ${datePart}`);
    }
    
    return parsedDate;
  };

  const calculateAge = (dateOfBirth: string | number | Date) => {
    // If dateOfBirth is a string in the format dd/MM/yyyy, parse it
    if (typeof dateOfBirth === 'string') {
      const [day, month, year] = dateOfBirth.split('/').map(Number);
      dateOfBirth = new Date(year, month - 1, day);
      console.log(dateOfBirth)
    }
  
    const diff = Date.now() - new Date(dateOfBirth).getTime();
    const age = new Date(diff).getUTCFullYear() - 1970;
    return age;
  };

  const selecteerSollicitatie = (sollicitatie: any, show: boolean) => {
    setSelected(sollicitatie)
    setShowModal(show)
  }

    return (
      <Fragment>
      <div className="px-4 mt-12 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">{components.shared.Sollicitaties.headTitle}</h1>
            <p className="mt-2 text-sm text-gray-700">
              {components.shared.Sollicitaties.subTitle}
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      {components.shared.Sollicitaties.fieldValues[0]}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {components.shared.Sollicitaties.fieldValues[1]}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {components.shared.Sollicitaties.fieldValues[2]}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {components.shared.Sollicitaties.fieldValues[3]}
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sollicitaties.map((sollicitatie) => (
                    <tr key={sollicitatie.vacature}>
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center">
                          <div className="h-11 w-11 flex-shrink-0">
                            <Image alt="freelancer profielfoto" src={sollicitatie.opdrachtnemer.profielfoto} height={16} width={16} className="h-11 w-11 rounded-full" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{sollicitatie.opdrachtnemer.naam}</div>
                            <div className="mt-1 text-gray-500">{sollicitatie.opdrachtnemer.stad}, {sollicitatie.opdrachtnemer.geboortedatum}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <div className="text-gray-900">{sollicitatie.opdrachtnemer.rating.toFixed(2)} {components.shared.Sollicitaties.attributes[1]}</div>
                        <div className="mt-1 text-gray-500">{sollicitatie.opdrachtnemer.klussen} {components.shared.Sollicitaties.attributes[0]}</div>
                      </td>
                      
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{sollicitatie.diensten.length} {components.shared.Sollicitaties.attributes[2]}</td>
                      <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button onClick= {
                          () => 
                          {
                            selecteerSollicitatie( sollicitatie, true )
                          }
                        }
                       className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {sollicitatie.diensten.length}<span className="sr-only">, {sollicitatie.opdrachtnemer.naam}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <SollicitatieModal sollicitatie={selected} isVisible={showModal} lang={lang}/>
      </Fragment>
    )
  };