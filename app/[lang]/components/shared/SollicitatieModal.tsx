'use client'

import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { Button } from '@/app/[lang]/components/ui/button'
import { useToast } from '@/app/[lang]/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { accepteerSollicitatieDiensten, alleDienstenAfwijzen, accepteerGeselecteerdeDiensten } from '@/app/lib/actions/vacancy.actions';
import mongoose from 'mongoose';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { IApplication } from '@/app/lib/models/application.model';

interface SollicitatieModalProps {
  sollicitatie: IApplication;
  isVisible: boolean;
  lang: Locale;
  components: {
    shared: {
      SollicitatieModal: any;
    };
  };
}

export default function SollicitatieModal({ sollicitatie, isVisible, lang, components }: SollicitatieModalProps) {
  const [open, setOpen] = useState(isVisible);
  const [geaccepteerd, setGeaccepteerd] = useState<any[]>([]);
  const { toast } = useToast();
  const router = useRouter();


  if (!isVisible) return null;

  const handleAccept = (dienstId: string) => {
    setGeaccepteerd((prev) =>
      prev.includes(dienstId) ? prev.filter((id) => id !== dienstId) : [...prev, dienstId]
    );
  };

  const verstuurOfferte = async (freelancerId: mongoose.Types.ObjectId | string, sollicitatieId: mongoose.Types.ObjectId | string, dienstenIds: mongoose.Types.ObjectId[]) => {
    const response = await accepteerGeselecteerdeDiensten({freelancerId, sollicitatieId, dienstenIds});
      if (response.success){
        toast({
          variant: 'succes',
          description: `${components.shared.SollicitatieModal.ToastMessage1}`
        });
        isVisible = false;
      } else {
        toast({
          variant: 'destructive',
          description: `${components.shared.SollicitatieModal.ToastMessage2} ${response.message}`
        });
        throw new Error('Het accepteren van werknemer niet mogelijk. Neem contact op voor vragen.');
      }
  }

  const alleAfwijzen = async (sollicitatieId: string) => {
    const response = await alleDienstenAfwijzen({sollicitatieId});
      if (response.success){
        toast({
          variant: 'succes',
          description: `${components.shared.SollicitatieModal.ToastMessage3}`
        });
        isVisible = false;
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          description: `${components.shared.SollicitatieModal.ToastMessage4} ${response.message}`
        });
        throw new Error('Het afwijzen van werknemer niet mogelijk. Neem contact op voor vragen.');
      }
  }

  const alleAccepteren = async (sollicitatieId: string) => {
    const response = await accepteerSollicitatieDiensten({sollicitatieId});
      if (response.success){
        toast({
          variant: 'succes',
          description: `${components.shared.SollicitatieModal.ToastMessage5}`
        });
        isVisible = false;
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          description: `${components.shared.SollicitatieModal.ToastMessage6} ${response.message}`
        });
        throw new Error('Het annuleren van werknemer niet mogelijk. Neem contact op voor vragen.');
      }
  }

  return (
    <>
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <div className="fixed inset-0" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <ul role="list" className="divide-y divide-gray-100">
      {sollicitatie.jobs.map((dienst) => (
        <li key={dienst.dienstId as unknown as string} className="relative flex justify-between py-5">
          <div className="flex gap-x-4 pr-6 sm:w-1/2 sm:flex-none">
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900">
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {dienst.date}
              </p>

              <p className="mt-1 flex text-xs/5 text-gray-500">
                {dienst.starting} - {dienst.ending}
              </p>

            </div>
          </div>
          <div className="flex items-center justify-between gap-x-4 sm:w-1/2 sm:flex-none">
            <div className="hidden sm:block">
              <p className="text-sm/6 text-gray-900">{components.shared.SollicitatieModal.currencySign}{dienst.amount}</p>
              {dienst.break ? (
                <p className="mt-1 text-xs/5 text-gray-500">
                {dienst.break} {components.shared.SollicitatieModal.fiedValues[0]}
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <p className="text-xs/5 text-gray-500">{components.shared.SollicitatieModal.fiedValues[1]}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => handleAccept(dienst.dienstId as unknown as string)}
              className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
            >
                {geaccepteerd.includes(dienst.dienstId) ? (
                    <CheckCircleIcon aria-hidden="true" className="size-8 bg-green-400" />
                ) : (
                  <p>  
                    {components.shared.SollicitatieModal.buttons[6]}
                    <span className="sr-only">, {sollicitatie.employees.name}
                    </span>
                    </p>
                )}
            </button>
          </div>
        </li>
      ))}
    </ul>
    </div>
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-base font-semibold text-gray-900">{components.shared.SollicitatieModal.fiedValues[2]}</DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-sky-500"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Main */}
                <div className="divide-y divide-gray-200">
                  <div className="pb-6">
                    <div className="h-24 bg-sky-700 sm:h-20 lg:h-28" />
                    <div className="-mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6 lg:-mt-16">
                      <div>
                        <div className="-m-1 flex">
                          <div className="inline-flex overflow-hidden rounded-lg border-4 border-white">
                            <img
                              alt={`Werknemer: ${sollicitatie.employees.name}`}
                              src={sollicitatie.employees.profilephoto}
                              className="size-24 shrink-0 sm:size-40 lg:size-48"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 sm:ml-6 sm:flex-1">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">{sollicitatie.employees.name}</h3>
                            <span className="ml-2.5 inline-block size-2 shrink-0 rounded-full bg-orange-400">
                              <span className="sr-only">{sollicitatie.employees.shifts} {components.shared.SollicitatieModal.fiedValues[3]}</span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{sollicitatie.employees.rating} {components.shared.SollicitatieModal.fiedValues[4]}</p>
                        </div>
                        <div className="mt-5 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0">
                          <button
                            type="button"
                            onClick={() =>{alleAccepteren(sollicitatie.id)}}
                            className="inline-flex w-full shrink-0 items-center justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:flex-1"
                          >
                            {`Accepteer alle (${sollicitatie.jobs.length})`}
                          </button>
                          <button
                            type="button"
                            onClick={() => {alleAfwijzen(sollicitatie.id)}}
                            className="inline-flex w-full flex-1 items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                          >
                            {components.shared.SollicitatieModal.buttons[2]} 
                          </button>
                          <div className="ml-3 inline-flex sm:ml-0">
                            <Menu as="div" className="relative inline-block text-left">
                              <MenuButton className="relative inline-flex items-center rounded-md bg-white p-2 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                <span className="absolute -inset-1" />
                                <span className="sr-only">Open options menu</span>
                                <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
                              </MenuButton>
                              <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                              >
                                <div className="py-1">
                                  <MenuItem>
                                    <a
                                      href="#"
                                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                    >
                                       {components.shared.SollicitatieModal.buttons[3]} {sollicitatie.employees.name}
                                    </a>
                                  </MenuItem>
                                  <MenuItem>
                                    <a
                                      href="#"
                                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                    >
                                       {components.shared.SollicitatieModal.buttons[5]}
                                    </a>
                                  </MenuItem>
                                  <MenuItem>
                                    <a
                                      href="#"
                                      className="block px-4 py-2 text-sm text-red-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                    >
                                      {components.shared.SollicitatieModal.buttons[4]}
                                    </a>
                                  </MenuItem>
                                </div>
                              </MenuItems>
                            </Menu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-5 sm:px-0 sm:py-0">
                    <dl className="space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200">
                      <div className="sm:flex sm:px-6 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0 lg:w-48">{components.shared.SollicitatieModal.fiedValues[5]}</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">
                          <p>
                            {sollicitatie.employees.bio}
                          </p>
                        </dd>
                      </div>
                      <div className="sm:flex sm:px-6 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0 lg:w-48">{components.shared.SollicitatieModal.fiedValues[6]}</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">{sollicitatie.employees.city}</dd>
                      </div>
                      <div className="sm:flex sm:px-6 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0 lg:w-48">{components.shared.SollicitatieModal.fiedValues[7]}</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">
                          <time dateTime="1982-06-23">{sollicitatie.employees.dateOfBirth}</time>
                        </dd>
                      </div>
                      <div className="sm:flex sm:px-6 sm:py-5">
                        <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0 lg:w-48">{components.shared.SollicitatieModal.fiedValues[8]}</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">{sollicitatie.employees.email}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
    <Button 
    onClick={() => verstuurOfferte(sollicitatie.employees.employeeId as unknown as string, sollicitatie.id, geaccepteerd)}
    className='bg-orange-400 font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:flex-1 rounded-md px-2 py-2 my-4' >
        {components.shared.SollicitatieModal.buttons[7]}
    </Button>
    </>
  )
};
