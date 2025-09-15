'use client'

import * as React from 'react';
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { IJob } from '@/app/lib/models/job.model';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { haalFreelancer } from '@/app/lib/actions/employee.actions';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { solliciteerOpVacature } from '@/app/lib/actions/vacancy.actions';
import { CalendarDateRangeIcon, BanknotesIcon, 
BuildingOffice2Icon, BriefcaseIcon, 
ClipboardDocumentCheckIcon } from '@heroicons/react/20/solid';


interface WerknemerPageClientProps {
  vacature: any;
  diensten: any[];
  lang: string;
  dictionary: any;
}




  
  export default function WerknemerPage({ vacature, diensten, lang, dictionary }: WerknemerPageClientProps) {
    
    const { isLoaded, user } = useUser();
    const [freelancer, setFreelancer] = useState<any>(null);
    const [freelancerId, setFreelancerId] = useState<any>(null);
    const [open, setOpen] = useState(true)
    const [aangevinkt, setAangevinkt] = useState<IJob[]>([]);
    const [checkedDiensten, setCheckedDiensten] = useState<{ [key: string]: boolean }>({});
    const components = dictionary.components;

      useEffect(() => {
        if (isLoaded && user) {
          setFreelancerId(user?.id)
        }
      }, [isLoaded, user]);
    
      useEffect(() => {
        const getFreelancerId = async () => {
          try {
            const freelancer = await haalFreelancer(user!.id);
            
            if (freelancer) {
              setFreelancer(freelancer);
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
      }, [freelancerId]);

      const handleChange = (dienst: IJob) => {
        setCheckedDiensten((prev) => ({
          ...prev,
          [dienst.date]: !prev[dienst.date], // Toggle checked state
        }));
      
        setAangevinkt((prev) =>
          prev.some((d) => d.date === dienst.date)
            ? prev.filter((d) => d.date !== dienst.date) // Remove if already selected
            : [...prev, dienst] // Add if not selected
        );
      };
        
        const features = [
            {
              name: 'Loon',
              description: `${components.forms.VacancyForm.salaris.currencySign} ${vacature.uurloon} / ${diensten.length}`,
              icon: BanknotesIcon,
            },
            {
              name: 'Data',
              description: `${components.forms.VacancyForm.salaris.fieldLabels[6]} ${vacature.begindatum} ${components.forms.VacancyForm.salaris.fieldLabels[7]} ${vacature.einddatum}`,
              icon: CalendarDateRangeIcon,
            },
            {
              name: 'Adres',
              description: vacature.adres,
              icon: BuildingOffice2Icon,
            },
            {
              name: 'Kledingsvoorschriften',
              description: vacature.kledingsvoorschriften?.length 
              ? vacature.kledingsvoorschriften.join(', ') 
              : 'Geen specifieke voorschriften',
              icon: BriefcaseIcon,
            },
            {
                name: 'Vaardigheden',
                description: vacature.vaardigheden?.length 
                ? vacature.vaardigheden.join(', ') 
                : 'Geen vaardigheden vereist', 
                icon: ClipboardDocumentCheckIcon,
              },
          ]

          const handleSubmit = async () => {
            try {
              // Zorg ervoor dat je freelancerObject en andere gegevens doorgeeft
              const freelancerObject = {
                _id: freelancer._id, // Dit moet het ID van de freelancer zijn
                naam: `{freelancer.voornaam} {freelancer.achternaam}`,
                profielfoto: freelancer.profielfoto,
                rating: freelancer.rating || 5,
                bio: freelancer.bio || " ",
                geboortedatum: freelancer.geboortedatum || "1990-01-01",
                klussen: freelancer.facturen.length ?? freelancer.diensten.length,
                stad: freelancer.stad,
                emailadres: freelancer.emailadres,
                telefoonnummer: freelancer.telefoonnummer,
                opdrachtgever: "opdrachtgever_id", // Dit moet het ID van de opdrachtgever zijn
              };
        
              // Verstuur de sollicitatie
              const response = await solliciteerOpVacature(vacature, freelancerObject, aangevinkt);
              
              console.log('Sollicitatie verstuurd:', response);
              setOpen(false); // Sluit het dialoogvenster als sollicitatie is verstuurd
        
            } catch (error) {
              console.error('Fout bij sollicitatie:', error);
              // Je kunt hier een foutmelding tonen aan de gebruiker
            }
          };


  return (
    <>
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
          <div className="px-6 lg:px-0 lg:pr-4 lg:pt-4">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-sky-600">{vacature.functie}</h2>
              <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
               {vacature.titel}
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                {vacature.beschrijving}
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon aria-hidden="true" className="absolute left-1 top-1 size-5 text-sky-600" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="sm:px-6 lg:px-0">
            <div className="relative isolate overflow-hidden bg-sky-500 px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-sky-100 opacity-20 ring-1 ring-inset ring-white"
              />
              <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                <img
                  alt="Product screenshot"
                  src={vacature.afbeelding}
                  width={2432}
                  height={1442}
                  className="-mb-12 w-[57rem] max-w-none rounded-tl-xl bg-gray-800 ring-1 ring-white/10"
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
              />
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <ul role="list" className="divide-y divide-gray-100">
      {diensten.map((dienst) => (
        <li key={dienst.datum} className="relative flex justify-between py-5">
          <div className="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none">
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900">
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {dienst.datum}
              </p>

              <p className="mt-1 flex text-xs/5 text-gray-500">
                {dienst.werktijden.begintijd} - {dienst.werktijden.eindtijd}
              </p>

            </div>
          </div>
          <div className="flex items-center justify-between gap-x-4 sm:w-1/2 sm:flex-none">
            <div className="hidden sm:block">
              <p className="text-sm/6 text-gray-900">{components.shared.EmployeePage.currencySign}{dienst.amount}</p>
              {dienst.werktijden.pauze ? (
                <p className="mt-1 text-xs/5 text-gray-500">
                 <time dateTime={dienst.werktijden.pauze}>{dienst.werktijden.pauze}</time> {components.shared.EmployeePage.fieldsItems[1]}
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <p className="text-xs/5 text-gray-500">{components.shared.EmployeePage.fieldsItems[2]}</p>
                </div>
              )}
            </div>
            <Checkbox
  checked={!!checkedDiensten[dienst.datum]} // Ensure boolean value
  onChange={() => handleChange(dienst)} // Pass dienst manually
  inputProps={{ 'aria-label': 'controlled' }}
/>
          </div>
        </li>
      ))}
    </ul>
    </div>
      </div>
    </div>
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-base font-semibold text-gray-900">{components.shared.EmployeePage.fieldsItems[0]}</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <ul role="list" className="divide-y divide-gray-100">
                    {aangevinkt.map((dienst) => (
                    <li key={dienst.date} className="relative flex justify-between py-5">
                    <div className="border-b border-gray-200 pb-5">
      <div className="sm:flex sm:items-baseline sm:justify-between">
        <div className="sm:w-0 sm:flex-1">
          <h1 id="message-heading" className="text-base font-semibold text-gray-900">
            {dienst.date}
          </h1>
          <p className="mt-1 truncate text-sm text-gray-500">{dienst.workingtime.starting} - {dienst.workingtime.ending}</p>
        </div>

        <div className="mt-4 flex items-center justify-between sm:ml-6 sm:mt-0 sm:shrink-0 sm:justify-start">
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            €{dienst.amount}
          </span>
        </div>
      </div>
    </div>
     </li>
        ))} 
                </ul>
                    </div>
                </div>


                <div className="flex shrink-0 justify-end px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:ring-red-400"
                  >
                    {components.shared.EmployeePage.buttons[0]}
                  </button>
                  <button
        type="button"
        onClick={handleSubmit} // Voeg de submit functie toe aan de knop
        className="ml-4 inline-flex justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      >
        {components.shared.EmployeePage.buttons[1]}
      </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
    </>
  )
};
