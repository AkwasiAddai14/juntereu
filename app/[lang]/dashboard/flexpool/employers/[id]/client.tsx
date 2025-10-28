"use client"

import { useEffect, useState } from 'react';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { useToast } from '@/app/[lang]/components/ui/use-toast';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import ShiftCard from '@/app/[lang]/components/shared/cards/Wrappers/ShiftWrapper';
import { StarIcon, ClockIcon } from 'lucide-react';
import { haalFlexpool, voegAanFlexpool, verwijderUitFlexpool } from '@/app/lib/actions/flexpool.actions';
import { haalAlleFreelancers } from '@/app/lib/actions/employee.actions';
import DashNav from '@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper';
import mongoose from 'mongoose';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation'
import { useUser } from "@clerk/nextjs";
import { AuthorisatieCheck } from '@/app/[lang]/dashboard/AuthorisatieCheck';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries';

export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}


interface Freelancer {
  _id: string;
  voornaam: string;
  achternaam: string;
  profielfoto: string;
  stad: string;
  ratingCount: number;
  rating: number;
}

export default function FlexpoolPage({ id, lang, dashboard }: { id: string, lang: Locale, dashboard: any }) {
  
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Freelancer | null>(null);
  const [shifts, setShifts] = useState<any[]>([]);
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [collegas, setCollegas] = useState<any[]>([]);
  const [laden, setLaden] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const [isBedrijf, setIsBedrijf] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const [geauthoriseerd, setGeauthoriseerd] = useState<Boolean>(false);
  

    useEffect(() => {
      const checkAuthorization = async () => {
        if (isLoaded && user && id) {
          try {
            console.log('Checking authorization for flexpool ID:', id);
            
            // First, get the flexpool data to check the employer
            const response = await fetch(`/api/flexpool/${id}`);
            if (!response.ok) {
              throw new Error('Failed to fetch flexpool data');
            }
            const flexpoolData = await response.json();
            console.log('Flexpool data:', flexpoolData);
            
            if (!flexpoolData) {
              console.log('Flexpool not found');
              setGeauthoriseerd(false);
              return;
            }
            
            // Check if the current user is the employer of this flexpool
            if (user && flexpoolData.employer) {
              // Get the current user's employer record
              const employerResponse = await fetch('/api/get-employer-by-clerk-id', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clerkId: user.id }),
              });
              
              if (employerResponse.ok) {
                const employerData = await employerResponse.json();
                console.log('Current user employer data:', employerData);
                console.log('Flexpool employer ID:', flexpoolData.employer);
                console.log('Current user employer ID:', employerData._id);
                
                const isAuthorized = employerData._id === flexpoolData.employer;
                console.log('Authorization result:', isAuthorized);
                setGeauthoriseerd(isAuthorized);
              } else {
                console.log('Failed to get employer data');
                setGeauthoriseerd(false);
              }
            } else {
              console.log('No user or flexpool employer found');
              setGeauthoriseerd(false);
            }
          } catch (error) {
            console.error('Authorization check failed:', error);
            setGeauthoriseerd(false);
          }
        }
      };

      checkAuthorization();
    }, [isLoaded, user, id]);

    if (geauthoriseerd === null) {
      return <h1>Loading...</h1>;
    }

    if(!geauthoriseerd){
      return <h1>403 - Forbidden</h1>
    }

    useEffect(() => {
      if (!isLoaded) return;
  
      if (!isSignedIn) {
        router.push("./sign-in");
        console.log("Niet ingelogd");
        alert(`${dashboard.Flexpool.employers.ToastMessage1}`);
        return;
      }
  
      const userType = user?.organizationMemberships.length ?? 0;
      setIsBedrijf(userType >= 1);
    }, [isLoaded, isSignedIn, router, user]);
  
    if(!isBedrijf){
      router.push('/dashboard');
    }


  const voegFreelancerToe = async () => {
    if (!selectedPerson) return; // Guard clause to prevent errors
    setLaden(true);
    try {


      const voegfreelancer = await voegAanFlexpool({
        flexpoolId: id as unknown as mongoose.Types.ObjectId,
        freelancerId: selectedPerson._id as unknown as mongoose.Types.ObjectId,
      })
      setCollegas((prevCollegas) => [...prevCollegas, selectedPerson._id]);
        toast({
          variant: 'succes',
          description: `${dashboard.Flexpool.employers.ToastMessage2}`
        });
        
    setLaden(false);
    } catch(error:any) {
      console.error("Error adding freelancer:", error);
        toast({
          variant: 'destructive',
          description: `${dashboard.Flexpool.employers.ToastMessage3}`
      });
    } 
  };

  const verwijderFreelancer = async (collega: { _id: unknown; }) => {
    try {
      const verwijderFreelancer = await verwijderUitFlexpool({
        flexpoolId: id as unknown as mongoose.Types.ObjectId,
        freelancerId: collega._id as unknown as mongoose.Types.ObjectId,
      });
      setCollegas((prevCollegas) => 
          prevCollegas.filter(collega => collega._id !== collega)
        );
      toast({
        variant: 'succes',
        description: `${dashboard.Flexpool.employers.ToastMessage4}`
      });

    } catch (error) {
      console.error('Error removing freelancer:', error);
      toast({
        variant: 'destructive',
        description: `${dashboard.Flexpool.employers.ToastMessage3}\n${error}`
    });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flexpool = await haalFlexpool(id);
       
        const opdrachtnemers = await haalAlleFreelancers();
       
  
        if (flexpool) {
          // Only update the state if the data has actually changed
          if (flexpool.shifts.length !== shifts.length) {
            setShifts(flexpool.shifts || []);
          }
          if (opdrachtnemers) {
            setFreelancers(opdrachtnemers || []);
          }
          if(flexpool.employees.length !== collegas.length){
            setCollegas(flexpool.employees || [])
          }
        } else {
          console.log("No shifts and no freelancers found.");
          setShifts([]);
          setFreelancers([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [id, collegas, shifts]);

  const filteredPeople = freelancers.filter(opdrachtnemers => {
    const naam = `${opdrachtnemers.voornaam.toLowerCase()} ${opdrachtnemers.achternaam.toLowerCase()}`;
    return naam.includes(query.toLowerCase());
  });

  return (
    <>
    <DashNav lang={lang}/>
    <div className="mt-10 pl-14 flex items-center justify-start">
      <Combobox
        as="div"
        value={selectedPerson}
        onChange={(person) => {
          setQuery('');
          setSelectedPerson(person);
        }}
      >
        <Label className="block text-sm font-medium leading-6 text-gray-900">{dashboard.Flexpool.employers.FormFieldItems[0]}</Label>
        <div className="relative mt-2">
          <ComboboxInput
            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            onChange={(event) => setQuery(event.target.value)}
            onBlur={() => setQuery('')}
            displayValue={(opdrachtnemer: any) => opdrachtnemer ? `${opdrachtnemer.voornaam} ${opdrachtnemer.achternaam}` : ''}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>

          {filteredPeople.length > 0 && (
            <ComboboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople.map((person) => (
                <ComboboxOption
                  key={person.achternaam}
                  value={person}
                  className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-sky-600 data-[focus]:text-white"
                >
                  <div className="flex items-center">
                    <img src={person.profielfoto} alt="profielfoto" className="h-6 w-6 flex-shrink-0 rounded-full" />
                    <span className="ml-3 truncate group-data-[selected]:font-semibold">{person.voornaam} {person.achternaam}</span>
                  </div>

                  <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-sky-600 group-data-[selected]:flex group-data-[focus]:text-white">
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          )}
        </div>
      </Combobox>
      <button className="rounded-md bg-sky-500 text-white ml-10 mt-7 px-4 py-2"
        onClick={voegFreelancerToe}
        disabled={!selectedPerson || laden}
      >
        {dashboard.Flexpool.employers.FormFieldItems[1]}
      </button>
      </div>


      <div className="w-full my-12">
      <h2 className="text-center text-2xl font-bold my-7">{dashboard.Flexpool.employers.FormFieldItems[2]}</h2>
      <ul role="list" className="pl-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {collegas.map((collega) => (
          <li
            key={collega._id}
            className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
          >
            <div className="flex flex-1 flex-col p-8">
              <img 
              src={collega.profielfoto} 
              alt="profielfoto"
              className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" 
              />
              <h3 className="mt-6 text-sm font-semibold text-gray-900">{collega.voornaam} {collega.achternaam}</h3>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Title</dt>
                <dd className="text-md text-gray-500">{collega.stad}</dd>
                <dd className="mt-3">
                <span className="inline-flex  mr-10 items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                {collega.ratingCount} {dashboard.Flexpool.employers.FormFieldItems[3]}
                </span>
                  <span className="inline-flex items-center justify-between rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                     {collega.rating} <StarIcon height={14} width={14} />
                  </span>
                </dd>
                <div className="flex justify-between font-medium items-center mt-4">
                  <div className='flex items-center'>
                <BriefcaseIcon height={18} width={18} />
                <dd className="ml-1 text-sm text-gray-900">{collega.opkomst} {dashboard.Flexpool.employers.FormFieldItems[4]}</dd>
                </div>
                <div className='flex items-center'>
                <ClockIcon height={18} width={18} />
                <dd className="ml-1 text-sm text-gray-900">{collega.punctualiteit}{dashboard.Flexpool.employers.FormFieldItems[5]} </dd>
                </div>
                </div>
              </dl>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                <button
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent text-sm font-semibold px-2 py-4 text-gray-900"
                  onClick={() => verwijderFreelancer(collega)}
                >
                  <XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-600" />
                  {dashboard.Flexpool.employers.FormFieldItems[2]}
                </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      </div>

      <div className="w-full h-full overflow-hidden  px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
      <h2 className="text-center text-2xl font-bold my-7">{dashboard.Flexpool.employers.FormFieldItems[7]}</h2>
        {shifts.length > 0 ? (
          <ScrollArea>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {shifts.slice(0, shifts.length).map((shiftItem, index) => (
                <ShiftCard key={index} shift={shiftItem} lang={lang} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="lg:pl-96 h-full overflow-hidden">{dashboard.Flexpool.employers.FormFieldItems[8]}</div>
        )}
      </div>
    </>
  );
};
