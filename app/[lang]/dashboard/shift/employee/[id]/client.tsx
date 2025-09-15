"use client"

import AanmeldButton from '@/app/[lang]/components/employees/AanmeldButton';
import Collection from '@/app/[lang]/components/employees/Collection';
import { checkAlreadyApplied } from '@/app/lib/actions/shift.actions'
import Image from 'next/image';
import calendar from '@/app/assets/images/calendar.svg';
import location from '@/app/assets/images/location-grey.svg'
import { UserIcon } from '@heroicons/react/20/solid';
import DashNav from '@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key, useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs"
import { haalFreelancerVoorAdres } from '@/app/lib/actions/employee.actions';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys



export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const shiftDetails = ({ lang, dashboard, shift, relatedEvents }: any) => {
  
  const [hasApplied, setHasApplied] = useState(false);
  const { isLoaded, user } = useUser();
  const [freelancerId, setFreelancerId] = useState<string>("");
  const [profielfoto, setProfilePhoto] = useState<string>("");
  

  useEffect(() => {
    if (isLoaded && user) {
      setProfilePhoto(user?.imageUrl)
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const getFreelancerId = async () => {
      try {
        const opdrachtnemer = await haalFreelancerVoorAdres(user!.id);
        if (opdrachtnemer) {
          setFreelancerId(opdrachtnemer._id.toString());
        } else{
          console.log("geen freelancerId gevonden.")
        }
      } catch (error) {
        console.error("Error fetching freelancer by Clerk ID:", error);
      }
    };
  
    if (user && !freelancerId) {  // Only fetch if user exists and freelancerId is not already set
      getFreelancerId();
    }
  })

  useEffect(()=>{
    const fetchApplied = async () => {
      const applied = await checkAlreadyApplied({ freelancerObjectId: freelancerId,
        shiftArrayObjectId: shift.id,})
      setHasApplied(applied);
    }
    fetchApplied();
  }, [freelancerId])
  
  
 
  return (
    <>
    <DashNav lang={lang}/>
    <section className="flex flex-col justify-center bg-primary-50 bg-dotted-pattern bg-contain">
      <div className="lg:grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl sm:flex xs:flex flex-col">
        <Image 
          src={shift.afbeelding}
          alt="hero image"
          width={1000}
          height={1000}
          className="h-full min-h-[300px] object-cover object-center"
        />
        <div className="flex w-full flex-col gap-8 p-5 md:p-10">
          <div className="flex flex-col gap-6">
            <h2 className='h2-bold'>{shift.titel}</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-between w-full flex gap-3">
                <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500 line-clamp-1">
                  {shift.opdrachtgeverNaam}
                </p>
                <p className="p-bold-20 rounded-full items-center bg-green-500/10 px-5 py-2 text-green-700">
                {dashboard.currencySign}{shift.uurtarief}
                </p>
                <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                  {shift.functie}
                </p>
              </div>

            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className='flex gap-2 md:gap-3'>
              <Image src={calendar} alt="calendar" width={32} height={32} className='sm:hidden'/>
              <div className="flex-between w-full p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                <p>
                {new Date(shift.begindatum).toLocaleDateString('nl-NL')}
                </p>
                <p>
                  {shift.begintijd} -  {' '}
                  {shift.eindtijd}
                </p>
              </div>
            </div>

            <div className="p-regular-20 flex items-center gap-3">
            <Image src={location} alt="location" width={32} height={32} />
              <p className="p-medium-16 lg:p-regular-20"> {shift.adres}</p>
              {/* <p className="p-medium-16 lg:p-regular-20"> {shift.stad}</p> */}
            </div>


            <div className='flex-between w-full '>
            <div className="p-regular-20 flex items-center gap-3">
              <UserIcon className='w-8 h-8'/>
              <p className="p-medium-16 lg:p-regular-20">{shift.plekken} {dashboard.Shift.employee.FormFieldItems[0]}</p>
            </div>
            <div className="p-regular-20 flex items-center gap-3">
              <p className="p-medium-16 lg:p-regular-20">{shift.aanmeldingen.length} {dashboard.Shift.employee.FormFieldItems[1]}</p>
            </div>
            <p className="p-medium-16 lg:p-regular-18 truncate text-primary-500">{shift.inFlexpool ? '✅ Flexpool' : `${dashboard.Shift.employee.FormFieldItems[2]}`}</p>
            </div>
           
            {shift.status === "beschikbaar" && shift.beschikbaar && !hasApplied && (
              <AanmeldButton shift={shift} />
              )}
              
          
          </div>
          <div className="flex justify-between items-center">
            <div className="">
              <h3>{dashboard.Shift.employer.FormFieldItems[4]}</h3>
            <ul className="rounded-md bg-blue-300 px-3 py-3 gap-y-2">
              {shift.vaardigheden?.map((vaardigheid: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
                 <li key={index}>• {vaardigheid}</li>
                  ))}
            </ul>
            </div>


            <div className="">
            <h3>{dashboard.Shift.employer.FormFieldItems[5]}</h3>
              <ul className="rounded-md bg-orange-300 px-3 py-3 gap-y-2">
                  {shift.kledingsvoorschriften?.map((kleding: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
                    <li key={index}>• {kleding}</li>
                  ))}
              </ul>
            </div>


          </div>
          <div className="flex flex-col gap-2">
            <p className="p-bold-20 text-grey-600">{dashboard.Shift.employee.FormFieldItems[3]}</p>
            <p className="p-medium-16 lg:p-regular-18 line-clamp-9">
              {shift.beschrijving} 
            </p>
          </div>
        </div>
      </div>
    </section>

      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12 xs:gap-20">
      <h2 className="h2-bold">{dashboard.Shift.employee.FormFieldItems[4]}</h2>
      <Collection 
          data={relatedEvents?.data}
          emptyTitle="Geen relevante shifts gevonden"
          emptyStateSubtext="Kom later nog eens terug"
          collectionType="All_Events"
          limit={36}
          page={1}
          totalPages={relatedEvents?.totalPages} 
          lang={lang}        />
    </section>
    </>
  )
}

export default shiftDetails;