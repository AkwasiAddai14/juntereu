'use client'

import { Dialog, Input, Transition } from '@headlessui/react';
import {  Bars3Icon,  CalendarIcon,  HomeIcon,  UserGroupIcon,  XMarkIcon,  DocumentCheckIcon,  BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useUser } from "@clerk/nextjs";
import { Fragment, useEffect, useState } from "react";
import React from 'react';
import Image from 'next/image';
import Calender from '@/app/[lang]/components/dashboard/CompanyDashboard/Calender/Calender';
import UitlogModal from '@/app/[lang]/components/shared/UitlogModal';
import { fetchBedrijfByClerkId } from "@/app/lib/actions/employer.actions";
import { accepteerCheckout, haalBedrijvenCheckouts } from '@/app/lib/actions/checkout.actions';
import { haalFlexpools, maakFlexpool } from "@/app/lib/actions/flexpool.actions";
import { haalGeplaatsteShifts, haalOngepubliceerdeShifts } from '@/app/lib/actions/shiftArray.actions';
import ShiftCard from '@/app/[lang]/components/shared/cards/ShiftArrayCard';
import FlexpoolCard from '@/app/[lang]/components/shared/cards/FlexpoolCard';
import { haalFacturen } from '@/app/lib/actions/invoice.actions';
import { IShiftArray } from '@/app/lib/models/shiftArray.model';
import mongoose from 'mongoose';
import { AlertDialog,   AlertDialogAction,   AlertDialogCancel, AlertDialogContent,   AlertDialogDescription, AlertDialogFooter,   AlertDialogHeader, AlertDialogTitle,   AlertDialogTrigger } from '@/app/[lang]/components/ui/alert-dialog';
import FactuurCard from '@/app/[lang]/components/shared/cards/InvoiceCard';
import { useRouter } from 'next/navigation';
import { toast } from '@/app/[lang]/components/ui/use-toast';
import CheckoutModal from '@/app/[lang]/components/shared/CheckoutModal';
import Card from '@/app/[lang]/components/shared/cards/CheckoutCard';
import { IVacancy } from '@/app/lib/models/vacancy.model';
import VacatureCard from '@/app/[lang]/components/shared/cards/VacancyCard';
import { haalGeplaatsteVacatures } from '@/app/lib/actions/vacancy.actions';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];




const navigation = [
  { name: 'Dashboard', value: 'Dashboard', icon: HomeIcon, current: true },
  { name: 'Geplaatste shifts', value: 'Shifts', icon: CalendarIcon, current: false },
  { name: 'Vacatures', value: 'Vacatures', icon: DocumentTextIcon, current: false },
  { name: 'Checkouts', value: 'Checkouts', icon: DocumentCheckIcon, current: false },
  { name: 'Facturen', value: 'Facturen', icon: BanknotesIcon, current: false },
  { name: 'Flexpools', value: 'Flexpools', icon: UserGroupIcon, current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


const Dashboard =  () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isLoaded, user } = useUser();
  const [position, setPosition] = useState("Dashboard");
  const [shift, setShift] = useState<IShiftArray[]>([]);
  const [vacatures, setVacatures] = useState<IVacancy[]>([]);
  const [unpublished, setUnpublished] = useState<IShiftArray[]>([]);
  const [factuur, setFactuur] = useState<any[]>([])
  const [checkout, setCheckout] = useState<any[]>([])
  const [flexpool, setFlexpool] = useState<any[]>([])
  const [profilePhoto, setProfilePhoto] = useState("");
  const [fullName, setFullName] = useState<string | null>(null);
  const [showLogOut, setShowLogOut] = useState(false);
  const [bedrijfiD, setBedrijfiD] = useState<string>("");
  const [newFlexpoolTitle, setNewFlexpoolTitle] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutId, setCheckoutID] = useState('')
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      setProfilePhoto(user.imageUrl);
      setFullName(user.fullName);
    }
  }, [isLoaded, user]);


  useEffect(() => {
    const getBedrijfId = async () => {
      try {
        const bedrijf = await fetchBedrijfByClerkId(user!.id);
        if (bedrijf && bedrijf._id) {
          setBedrijfiD(bedrijf._id.toString());
        }
      } catch (error) {
        console.error("Error fetching bedrijf by Clerk ID:", error);
      }
    };
  
    if (user && !bedrijfiD) {  // Only fetch if user exists and bedrijfiD is not already set
      getBedrijfId();
    }
  }, [user]); // Dependency array ensures this runs only when `user` changes
  

  useEffect(() => {
    if (bedrijfiD) {
      const fetchShifts = async () => {
        try {
          const shifts = await haalGeplaatsteShifts({ employerId: bedrijfiD });
          setShift(shifts || []);
        } catch (error) {
          console.error('Error fetching shifts:', error);
          setShift([]);
        }
      };
      fetchShifts();
    }
  }, [bedrijfiD]); 

  useEffect(() => {
    if (bedrijfiD) {
      const fetchVacatures = async () => {
        try {
          const vacatures = await haalGeplaatsteVacatures({ bedrijfId: bedrijfiD });
          setVacatures(vacatures || []);
        } catch (error) {
          console.error('Error fetching vacature:', error);
          setVacatures([]);
        }
      };
      fetchVacatures();
    }
  }, [bedrijfiD]); 

  useEffect(() => {
    if (bedrijfiD) {  // Only fetch shifts if bedrijfId is available
      const fetchShifts = async () => {
        try {
          const shifts = await haalOngepubliceerdeShifts({ bedrijfId: bedrijfiD });
          setUnpublished(shifts || []);  // Ensure shifts is always an array
        } catch (error) {
          console.error('Error fetching shifts:', error);
          setUnpublished([]);  // Handle error by setting an empty array
        }
      };
      fetchShifts();
    }
  }, [bedrijfiD]); 


  useEffect(() =>{
    if(bedrijfiD){
      const fetchFlexpool = async () => {
        try {        
          const flexpools = await haalFlexpools(bedrijfiD);
          setFlexpool(flexpools || []);
        } catch (error){
          console.log('Error fetching flexpools:', error);
          setFlexpool([]);
          }
              }
              fetchFlexpool();
            }
          }, [bedrijfiD])

          useEffect(() => {
            const fetchCheckout = async () => {
              try {
                if (bedrijfiD) {
                  const fetchedCheckout = await haalBedrijvenCheckouts(bedrijfiD);
                  setCheckout(fetchedCheckout ?? []); // Set the fetched checkouts to state
                  console.log(checkout)
                }
              } catch (error) {
                console.error('Error fetching checkouts:', error);
              }
            };
          
            fetchCheckout();
          }, [bedrijfiD]); // Add user.id to the dependency array  
          
          useEffect(() => {
            const fetchFactuur = async () => {
              try {
                if (bedrijfiD !== '') {
                  const fetchedFactuur = await haalFacturen(bedrijfiD);
                  setFactuur(fetchedFactuur || []);
                }
              } catch (error) {
                console.error('Error fetching facturen:', error);
              }
            };
          
            fetchFactuur();
          }, [bedrijfiD]); // Voeg checkout toe aan de dependency array  
          
    
          const voegFlexpoolToe = async () => {
            try {
              if (!bedrijfiD) {
                console.error("BedrijfId is not available");
                return;
              }
             const niewFlexpool =  await maakFlexpool({
                titel: newFlexpoolTitle.trim(),
                bedrijfId: bedrijfiD as unknown as mongoose.Types.ObjectId,
              });
              // You should manage the flexpools state in the parent component and update it here
              setNewFlexpoolTitle("");
              setFlexpool((prevFlexpool) => [...prevFlexpool, niewFlexpool]);
            } catch (error) {
              console.error("Error creating flexpool:", error);
            }
          };

          const MenuSluiten = (value: string) => {
            setPosition(value);
            setSidebarOpen(false);
          }

          const handleCheckoutAcceptance =async (shiftId:string) => {
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
                  description: "Checkout verstuurd! 👍"
                });
                router.refresh();
              } else {
                toast({
                  variant: 'destructive',
                  description: "Actie is niet toegestaan! ❌"
                });
              }
            } catch (error) {
              console.error('Failed to submit checkout:', error);
          } 
        }

          
  function setOpen(arg0: boolean, arg1: string): void {
    setShowCheckout(arg0);
    setCheckoutID(arg1);
  }

  
  return (
    <Fragment>
    <>
      <div>
        <Transition show={sidebarOpen}>
          <Dialog className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>

                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                    <button 
             onClick={() => 
              setShowLogOut(true)
             } >
            <Image
              alt="Your Company"
              src={profilePhoto || "/placeholder-avatar.svg"}
              className="h-8 w-auto rounded-full"
              width={8}
              height={8}
            />
            </button>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="-mx-2 flex-1 space-y-1">
                        {navigation.map((item) => (
                          <button
                          key={item.name}
                          onClick={() => setPosition(item.value)}
                          className={classNames(
                            position === item.value ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                            'group flex w-full items-center justify-center gap-x-3 rounded-md p-3 text-sm font-semibold'
                          )}
                        >
                          <item.icon aria-hidden="true" className="h-6 w-6" />
                          <span className="sr-only">{item.name}</span>
                        </button>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-800 lg:pb-4">
          <div className="flex h-16 shrink-0 items-center justify-center">
          <button 
             onClick={() => 
              setShowLogOut(true)
             } >
            <Image
              alt="Your Company"
              src={profilePhoto || "/placeholder-avatar.svg"}
              className="h-8 w-auto rounded-full"
              width={8}
              height={8}
            />
            </button>
          </div>
          <nav className="mt-8">
            <ul role="list" className="flex flex-col items-center space-y-1">
              {navigation.map((item) => (
                <button
                key={item.name}
                onClick={() => setPosition(item.value)}
                className={classNames(
                  position === item.value ? 'bg-gray-800 text-white px-5' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                  'group flex w-full items-center justify-center gap-x-3 rounded-md p-3 text-sm font-semibold'
                )}
              >
                <item.icon aria-hidden="true" className="h-6 w-6" />
                <span className="sr-only">{item.name}</span>
              </button>
              ))}
            </ul>
          </nav>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">Dashboard</div>
          <a href="/">
            <span className="sr-only">{fullName}</span>
            <Image
              className="h-8 w-8 rounded-full bg-gray-800"
              src={profilePhoto || "/placeholder-avatar.svg"}
              alt="Profielfoto"
              width={8}
              height={8}
            />
          </a>
        </div>


        
        {/* Main area */}
         <main className="lg:pl-20 h-full overflow-hidden">

          
            <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            {position === 'Dashboard' && ( <Calender dashboard={undefined} lang={'at'}/> )}
            </div>

            <div className="lg:pl-96 ml-6 h-full overflow-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            { position === 'Shifts' ? (
                    shift.length > 0 ? (
                      <div className="space-y-12">
                        {/* Vacancies Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Vacatures</h1>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {vacatures.length} actief
                              </span>
                            </div>
                          </div>
                          
                          {vacatures.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {vacatures.map((vacaturesItem, index) => (
                                <VacatureCard 
                                  key={index} 
                                  vacature={vacaturesItem} 
                                  lang={lang} 
                                  components={dashboard?.components || {}} 
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <div className="mx-auto h-12 w-12 text-gray-400">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <h3 className="mt-2 text-sm font-medium text-gray-900">Geen vacatures beschikbaar</h3>
                              <p className="mt-1 text-sm text-gray-500">Er zijn momenteel geen vacatures gepubliceerd.</p>
                            </div>
                          )}
                        </div>

                        {/* Published Shifts Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Gepubliceerde Shifts</h1>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {shift.length} actief
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shift.map((shiftItem, index) => (
                              <ShiftCard 
                                key={index} 
                                shift={shiftItem} 
                                components={dashboard?.components || {}} 
                                lang={lang} 
                              />
                            ))}
                          </div>
                        </div>

                        {/* Unpublished Shifts Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Ongepubliceerde Shifts</h1>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {unpublished.length} concept
                              </span>
                            </div>
                          </div>
                          
                          {unpublished.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {unpublished.map((unpublishedItem, index) => (
                                <ShiftCard 
                                  key={index} 
                                  shift={unpublishedItem} 
                                  components={dashboard?.components || {}} 
                                  lang={lang} 
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <div className="mx-auto h-12 w-12 text-gray-400">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <h3 className="mt-2 text-sm font-medium text-gray-900">Geen concepten beschikbaar</h3>
                              <p className="mt-1 text-sm text-gray-500">Er zijn momenteel geen ongepubliceerde shifts.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-12">
                        {/* Vacancies Section - Empty State */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Vacatures</h1>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                0 actief
                              </span>
                            </div>
                          </div>
                          
                          {vacatures.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {vacatures.map((vacaturesItem, index) => (
                                <VacatureCard 
                                  key={index} 
                                  vacature={vacaturesItem} 
                                  lang={lang} 
                                  components={dashboard?.components || {}} 
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <div className="mx-auto h-12 w-12 text-gray-400">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <h3 className="mt-2 text-sm font-medium text-gray-900">Geen vacatures beschikbaar</h3>
                              <p className="mt-1 text-sm text-gray-500">Er zijn momenteel geen vacatures gepubliceerd.</p>
                            </div>
                          )}
                        </div>

                        {/* Empty Shifts State */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="text-center py-12">
                            <div className="mx-auto h-12 w-12 text-gray-400">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Geen shifts beschikbaar</h3>
                            <p className="mt-1 text-sm text-gray-500">Er zijn momenteel geen shifts gepubliceerd.</p>
                          </div>
                        </div>
                      </div>
                    )
                  ) : null
                } 

              {position === 'Vacatures' ? (
                <div className="space-y-8">
                  {/* Vacancies Header */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">Vacatures Beheer</h1>
                        <p className="mt-2 text-sm text-gray-600">Beheer al je gepubliceerde vacatures op één plek</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Nieuwe Vacature
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-900">Totaal Vacatures</p>
                            <p className="text-2xl font-bold text-blue-600">{vacatures.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-900">Actief</p>
                            <p className="text-2xl font-bold text-green-600">{vacatures.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-yellow-900">In Concept</p>
                            <p className="text-2xl font-bold text-yellow-600">0</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vacancies List */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Alle Vacatures</h2>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {vacatures.length} vacatures
                        </span>
                      </div>
                    </div>
                    
                    {vacatures.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vacatures.map((vacaturesItem, index) => (
                          <VacatureCard 
                            key={index} 
                            vacature={vacaturesItem} 
                            lang={lang} 
                            components={dashboard?.components || {}} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 text-gray-400">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Geen vacatures beschikbaar</h3>
                        <p className="mt-1 text-sm text-gray-500">Begin met het maken van je eerste vacature.</p>
                        <div className="mt-6">
                          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Eerste Vacature Maken
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {position === 'Checkouts' ? 
              checkout.length > 0 ? (
                <ScrollArea>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {checkout.slice(0, 9).map((checkoutItem, index) => (
                      <Card key={index} shift={checkoutItem} components={dashboard?.components || {}} />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="lg:pl-96 h-full overflow-hidden"> Geen checkouts beschikbaar </div>
              ): null 
              }


              {position === 'Facturen' ? 
              factuur.length > 0 ? (
                <ScrollArea>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {factuur.slice(0, 9).map((factuurItem, index) => (
                      <FactuurCard key={index} factuur={factuurItem} components={dashboard?.components || {}} />
                    ))}
                  </div>
                </ScrollArea>
               ) : (
                <div className="lg:pl-96 h-full overflow-hidden"> Geen facturen gevonden </div> 
              ): null 
              }


              {position === 'Flexpools' ?
              flexpool.length > 0 ? (
                <ScrollArea>
                  <AlertDialog>
                        <AlertDialogTrigger className="p-medium-14 my-10 flex w-32 rounded-md bg-sky-500 py-3 justify-center items-center text-primary-50 hover:bg-primary-50 focus:text-primary-500">
                            Maak flexpool
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Flexpool</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <Input type="text" placeholder="flexpool toevoegen" className="input-field mt-3" onChange={(e) => setNewFlexpoolTitle(e.target.value)} />
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuleer</AlertDialogCancel>
                                <AlertDialogAction onClick={voegFlexpoolToe}>Toevoegen</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  <div className="grid grid-cols-3 gap-4">
                    {flexpool.slice(0, 9).map((flexpoolItem, index) => (
                      <FlexpoolCard key={index} flexpool={flexpoolItem} components={dashboard?.components || {}} />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="lg:pl-96 h-full overflow-hidden"> Geen flexpools beschikbaar </div>
              ): null 
              }
              </div>
        </main>


        {sidebarOpen || (
        <aside className="fixed inset-y-0 left-20 hidden lg:block lg:w-96 overflow-hidden border-r border-gray-200 px-4 py-6  lg:px-8">
        <div className="h-full py-2 px-2 items-stretch rounded-lg border-2 border-b flex flex-col">
          <div className="h-1/3 border-2 rounded-lg flex flex-col">
            <div className="w-full border-b-2 h-10">
              <p className="italic font-mono text-lg font-semibold text-center mt-2">Shifts</p>
            </div>
            <div className="flex-grow overflow-hidden">
            <ScrollArea className="h-full overflow-auto">
            {shift.map((shiftItem, index) => {
  return (
    <li key={index} className="col-span-1 flex rounded-md shadow-sm">
      <div className="flex flex-1 items-center justify-between truncate border-b border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <a href={`/dashboard/shift/bedrijf/${shiftItem._id}`} className="font-medium text-gray-900 hover:text-gray-600">
            {shiftItem.title}
          </a>
          <p className="text-gray-500">{shiftItem.startingDate ? new Date(shiftItem.startingDate).toLocaleDateString('nl-NL') : 'Datum niet beschikbaar'}</p>
          <p className="text-gray-500">{shiftItem.applications ? shiftItem.applications.length : 0} Aanmeldingen</p>
          <p className="text-gray-500">{shiftItem.spots ?? 0} Plekken</p>
          <p className="text-gray-500">{shiftItem.accepted ? shiftItem.accepted.length : 0} Aangenomen</p>
        </div>
      </div>
      <div className="mt-10 h-16 w-16 items-center justify-center overflow-hidden">
        <Image
          src={shiftItem.image || "https://utfs.io/f/72e72065-b298-4ffd-b1a2-4d12b06230c9-n2dnlw.webp"}
          width={32}
          height={32}
          alt={shiftItem.employerName || "shift"}
          className="object-contain rounded-full"
        />
      </div>
    </li>
  );
})}

              </ScrollArea>
            </div>
          </div>
      
          <div className="h-1/3 border-2 rounded-lg flex flex-col mt-2">
            <div className="w-full border-b-2 h-10">
              <p className="mt-2 italic font-mono text-lg font-semibold text-center">Checkouts</p>
            </div>
            <div className="flex-grow overflow-hidden">
            <ScrollArea className="h-full overflow-auto">
                  {checkout.map((checkoutItem, index) => (
                    <li key={index} className="col-span-1 flex rounded-md shadow-sm">
                      <div className="flex flex-1 items-center justify-between truncate border-b border-gray-200 bg-white">
                      <div className="flex-1 truncate px-4 py-2 text-sm">
                         
                      <div className="flex justify-between">
                      <a href={`/dashboard/checkout/bedrijf/${checkoutItem._id}`} className="font-medium text-gray-900 hover:text-gray-600">
                        {checkoutItem.titel}
                      </a>
                      <p className="text-gray-500">€{checkoutItem?.uurtarief}</p>
                      </div>
                      <p className="text-gray-500">
                        {checkoutItem?.begindatum ? new Date(checkoutItem.begindatum).toLocaleDateString('nl-NL') : 'Datum'}
                        </p>
                        <div className="flex justify-between">
                        <p className="text-gray-500">
                        {checkoutItem?.begintijd || 'Begintijd'} - {checkoutItem?.eindtijd || 'Eindtijd'}
                        </p>
                        <p className="text-gray-500">{checkoutItem?.pauze || 'Pauze'} minuten pauze</p>
                        </div>
                        <div className="flex justify-between">
                        <p>
                        {checkoutItem?.checkoutbegintijd || 'Begintijd'} - {checkoutItem?.checkouteindtijd || 'Eindtijd'}
                        </p>
                        <p>{checkoutItem?.checkoutpauze || '0'} minuten pauze</p>
                        </div>
                        <div className="flex justify-between">
                        <p>{checkoutItem?.freelancerVoornaam || '0'} {checkoutItem?.freelancerAchternaam || '0'}</p>
                        <div className="items-center justify-center overflow-hidden">
                        <Image
                          src={checkoutItem?.freelancerProfielfoto || "https://utfs.io/f/72e72065-b298-4ffd-b1a2-4d12b06230c9-n2dnlw.webp"}
                          width={48}
                          height={48}
                          alt={checkoutItem?.freelancerVoornaam || "Freelancer"}
                          className="object-contain rounded-full"
                        />
                      </div> 
                        </div> 
                        <div className='mt-4 flex justify-between'>
                        <button onClick={() => setOpen(true, checkoutItem._id)} className="inline-flex ml-2 items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-green-600/20">
                          Weigeren
                        </button>         
                        <button onClick={() => handleCheckoutAcceptance(checkoutItem._id)}
                       className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Accepteren
                        </button> 
                        </div> 
                      </div>
                      </div>
                    </li>
                  ))}
                </ScrollArea>               
            </div>
          </div>
      
          <div className="h-1/3 border-2 rounded-lg flex flex-col mt-2">
            <div className="w-full border-b-2 h-10">
              <p className="mt-2 italic font-mono text-lg font-semibold text-center">Facturen</p>
            </div>
            <div className="flex-grow overflow-hidden">
              <ScrollArea className="h-full overflow-auto">
                {factuur.map((factuurItem, index) => (
                  <li key={index} className="col-span-1 flex rounded-md shadow-sm">
                     <div className="flex flex-1 items-center justify-between truncate border-b border-gray-200 bg-white">
                      <div className="flex-1 truncate px-4 py-2 text-sm">
                        <a href={`/dashboard/factuur/bedrijf/${factuurItem._id}`} className="font-medium text-gray-900 hover:text-gray-600">
                          Week {factuurItem.week} 
                        </a>
                        {factuurItem.shifts?.length === 1 ? (
                   <>
               <p className="text-gray-500">
                 {factuurItem.shifts?.length} shift 
               </p>
             </>
            ) : (
              <p className="text-gray-500">
                {factuurItem.shifts?.length} shifts
              </p>
            )}
                        <div className="flex flex-1 items-center justify-between">
                        <p className="text-gray-500">€{factuurItem.totaalbedrag} </p>
                        {factuurItem.isVoltooid ? (
                        <p className="text-green-600">Paid</p>
                        ) : (
                          <p className="text-gray-500">Unpaid</p>
                        )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ScrollArea>
            </div>
          </div>
        </div>
      </aside>
      )}

    </div>
  </>
    <UitlogModal isVisible={showLogOut} onClose={() => setShowLogOut(false)} components={{
        shared: {
          UitlogModal: {
            headtitle: '',
            subTitle: '',
            buttons: []
          }
        }
      }}/>
    <CheckoutModal 
        isVisible={showCheckout}
        onClose={() => setShowCheckout(false)} 
        shiftId={checkoutId}
        lang={lang}
        components={dashboard?.components || {}}    />
    </Fragment>
  )
}


export default Dashboard