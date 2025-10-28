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
import { haalGeplaatsteShifts, haalOngepubliceerdeShifts, haalActieveShifts } from '@/app/lib/actions/shiftArray.actions';
import ShiftCard from '@/app/[lang]/components/shared/cards/ShiftArrayCard';
import FlexpoolCard from '@/app/[lang]/components/shared/cards/FlexpoolCard';
import { haalFacturen } from '@/app/lib/actions/invoice.actions';
import { IShiftArray } from '@/app/lib/models/shiftArray.model';
import mongoose from 'mongoose';
import { AlertDialog,   AlertDialogAction,   AlertDialogCancel, AlertDialogContent,   AlertDialogDescription, AlertDialogFooter,   AlertDialogHeader, AlertDialogTitle,   AlertDialogTrigger } from '@/app/[lang]/components/ui/alert-dialog';
import { Button } from '@/app/[lang]/components/ui/button';
import FactuurCard from '@/app/[lang]/components/shared/cards/InvoiceCard';
import { useRouter } from 'next/navigation';
import { toast } from '@/app/[lang]/components/ui/use-toast';
import Checkoutgegevens from '@/app/[lang]/components/shared/CheckoutModal';
import Card from '@/app/[lang]/components/shared/cards/CheckoutCard';
import { IVacancy } from '@/app/lib/models/vacancy.model';
import VacatureCard from '@/app/[lang]/components/shared/cards/VacancyCard';
import { haalGeplaatsteVacatures } from '@/app/lib/actions/vacancy.actions';
import { getDictionary } from '@/app/[lang]/dictionaries';
import ChatBotIcon from '@/app/[lang]/components/dashboard/EmployeeDashboard/AI-assistent/ChatBot';
import ChatScreen from '@/app/[lang]/components/dashboard/EmployeeDashboard/AI-assistent/ChatScreen';
import EnhancedBudgetForm from '@/app/[lang]/components/dashboard/CompanyDashboard/Budget/EnhancedBudgetForm';
import { getActiveBudget } from '@/app/lib/actions/budget.actions';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];




const navigation = [
  { name: 'Dashboard', value: 'Dashboard', icon: HomeIcon, current: true },
  { name: 'Geplaatste shifts', value: 'Shifts', icon: CalendarIcon, current: false },
  { name: 'Checkouts', value: 'Checkouts', icon: DocumentCheckIcon, current: false },
  { name: 'Facturen', value: 'Facturen', icon: BanknotesIcon, current: false },
  { name: 'Flexpools', value: 'Flexpools', icon: UserGroupIcon, current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface DashboardClientProps {
  lang: Locale;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

const Dashboard = ({ lang, dashboard }: { lang: Locale; dashboard: any }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isLoaded, user } = useUser();
  const [position, setPosition] = useState("Dashboard");
  const [shift, setShift] = useState<IShiftArray[]>([]);
  const [activeShifts, setActiveShifts] = useState<IShiftArray[]>([]);
  const [vacatures, setVacatures] = useState<IVacancy[]>([]);
  const [unpublished, setUnpublished] = useState<IShiftArray[]>([]);
  const [factuur, setFactuur] = useState<any[]>([]);
  const [checkout, setCheckout] = useState<any[]>([]);
  const [flexpool, setFlexpool] = useState<any[]>([]);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [fullName, setFullName] = useState<string | null>(null);
  const [showLogOut, setShowLogOut] = useState(false);
  const [bedrijfiD, setBedrijfiD] = useState<string>("");
  const [newFlexpoolTitle, setNewFlexpoolTitle] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutId, setCheckoutID] = useState('')
  const [showChat, setShowChat] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [activeBudget, setActiveBudget] = useState<any>(null);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const router = useRouter();
  //const { dashboard } = dictionary;

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
      const fetchActiveShifts = async () => {
        try {
          const activeShifts = await haalActieveShifts({ employerId: bedrijfiD });
          setActiveShifts(activeShifts || []);
        } catch (error) {
          console.error('Error fetching active shifts:', error);
          setActiveShifts([]);
        }
      };
      fetchActiveShifts();
    }
  }, [bedrijfiD]);

  // Fetch active budget
  useEffect(() => {
    const fetchActiveBudget = async () => {
      if (!bedrijfiD) return;
      
      setBudgetLoading(true);
      try {
        const budget = await getActiveBudget(bedrijfiD);
        setActiveBudget(budget);
      } catch (error) {
        console.error('Error fetching active budget:', error);
      } finally {
        setBudgetLoading(false);
      }
    };

    fetchActiveBudget();
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
              setNewFlexpoolTitle('');
              setFlexpool((prevFlexpool) => [...prevFlexpool, niewFlexpool]);
            } catch (error) {
              console.error("Error creating flexpool:", error);
            }
          };

          const MenuSluiten = (value: string) => {
            setPosition(value);
            setSidebarOpen(false);
          }

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
              alt={user?.fullName || 'Your Company'}
              src={profilePhoto || '/placeholder-avatar.svg'}
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
              src={profilePhoto || '/placeholder-avatar.svg'}
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
          <div className="flex-1 text-sm font-semibold leading-6 text-white">{dashboard.werkgeversPage.Dashboard.headTitle}</div>
          <a href="/">
            <span className="sr-only">{fullName}</span>
            <Image
              className="h-8 w-8 rounded-full bg-gray-800"
              src={profilePhoto || '/placeholder-avatar.svg'}
              alt="Profielfoto"
              width={8}
              height={8}
            />
          </a>
        </div>


        
        {/* Main area */}
         <main className="lg:pl-20 h-full overflow-hidden">

          
            <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            {position === 'Shifts' && ( <Calender dashboard={dashboard} lang={lang}/> )}
            </div>

            <div className="lg:pl-96 ml-6 h-full overflow-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            {/* { position === 'Dashboard' ? (
                    shift.length > 0 ? (
                      <>


                      <ScrollArea>
                  <h1 className='mb-10 items-center justify-center text-4xl'>{dashboard.werkgeversPage.Dashboard.texts[0].name}</h1>
                  {vacatures.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {vacatures.slice(0, shift.length).map((vacaturesItem, index) => (
        <VacatureCard key={index} vacature={vacaturesItem} lang={lang} components={dashboard.components}/>
      ))}
    </div>
  ) : (
    <p className="text-center text-lg text-gray-500">{dashboard.werkgeversPage.Dashboard.texts[0].notFound}</p>
  )}
                    </ScrollArea>


                  <ScrollArea>
                  <h1 className='mb-10 items-center justify-center text-4xl'>{dashboard.werkgeversPage.Dashboard.texts[1].name}</h1>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {shift.slice(0, shift.length).map((shiftItem, index) => (
                        <ShiftCard key={index} shift={shiftItem} components={dashboard.components} lang={lang}/>
                      ))}
                      </div>
                    </ScrollArea>

                    <ScrollArea>
                      <h1 className='my-10 items-center justify-center text-4xl'>{dashboard.werkgeversPage.Dashboard.texts[3].name}</h1>
                    <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {unpublished.slice(0, unpublished.length).map((unpublishedItem, index) => (
                          <ShiftCard key={index} shift={unpublishedItem} components={dashboard.components} lang={lang}/>
                        ))}
                    </div>
                  </ScrollArea>


                    </>
                    ) : (
                      <>

                      <ScrollArea>

                  <h1 className='mb-10 items-center justify-center text-4xl'>{dashboard.werkgeversPage.Dashboard.texts[0].name}</h1>
                  
                  {vacatures.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {vacatures.slice(0, shift.length).map((vacaturesItem, index) => (
        <VacatureCard key={index} vacature={vacaturesItem} lang={lang} components={dashboard.components}/>
      ))}
    </div>
  ) : (
    <p className="text-center text-lg text-gray-500">{dashboard.werkgeversPage.Dashboard.texts[0].notFound}</p>
  )}

                    </ScrollArea>

                  <div className="lg:pl-96 h-full overflow-hidden">{dashboard.werkgeversPage.Dashboard.texts[1].notFound}</div>


                        </>
                    )
                  ) : null
                }  */}

{ position === 'Dashboard' ? (
                    shift.length > 0 ? (
                      <div className="space-y-12">
                        {/* Stats Bar */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                          <div className="grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="bg-white px-4 py-6 sm:px-6 lg:px-8">
                              <p className="text-sm/6 font-medium text-gray-500">{dashboard.werkgeversPage.Dashboard.statistics?.totalShifts || "Active Shifts"}</p>
                              <p className="mt-2 flex items-baseline gap-x-2">
                                <span className="text-4xl font-semibold tracking-tight text-gray-900">{activeShifts.length}</span>
                              </p>
                            </div>
                            <div className="bg-white px-4 py-6 sm:px-6 lg:px-8">
                              <p className="text-sm/6 font-medium text-gray-500">{dashboard.werkgeversPage.Dashboard.statistics?.activeVacancies || "Active Vacancies"}</p>
                              <p className="mt-2 flex items-baseline gap-x-2">
                                <span className="text-4xl font-semibold tracking-tight text-gray-900">{vacatures.length}</span>
                              </p>
                            </div>
                            <div className="bg-white px-4 py-6 sm:px-6 lg:px-8">
                              <p className="text-sm/6 font-medium text-gray-500">{dashboard.werkgeversPage.Dashboard.statistics?.pendingCheckouts || "Pending Checkouts"}</p>
                              <p className="mt-2 flex items-baseline gap-x-2">
                                <span className="text-4xl font-semibold tracking-tight text-gray-900">{checkout.length}</span>
                              </p>
                            </div>
                            <div className="bg-white px-4 py-6 sm:px-6 lg:px-8">
                              <p className="text-sm/6 font-medium text-gray-500">{dashboard.werkgeversPage.Dashboard.statistics?.totalInvoices || "Total Invoices"}</p>
                              <p className="mt-2 flex items-baseline gap-x-2">
                                <span className="text-4xl font-semibold tracking-tight text-gray-900">{factuur.length}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Budget Button */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Budget Management</h3>
                              <p className="text-sm text-gray-500">
                                {activeBudget ? 'Manage your current budget' : 'Set up a budget to track your spending'}
                              </p>
                            </div>
                            <Button
                              onClick={() => setShowBudgetForm(true)}
                              disabled={budgetLoading}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                            >
                              {budgetLoading ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Loading...
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                  {activeBudget ? 'Edit Budget' : 'Create Budget'}
                                </>
                              )}
                            </Button>
                          </div>
                          {activeBudget && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-blue-900">{activeBudget.name}</p>
                                  <p className="text-xs text-blue-700">
                                    {activeBudget.budgetAmount.currency} {activeBudget.budgetAmount.total.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                                    {activeBudget.budgetAmount.isPercentage && ` (${activeBudget.budgetAmount.percentage}% of revenue)`}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-blue-900">
                                    {activeBudget.budgetAmount.currency} {activeBudget.spending.total.toLocaleString('nl-NL', { minimumFractionDigits: 2 })} spent
                                  </p>
                                  <p className="text-xs text-blue-700">
                                    {((activeBudget.spending.total / activeBudget.budgetAmount.total) * 100).toFixed(1)}% utilized
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Vacancies Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">{dashboard.werkgeversPage.Dashboard.texts[0].name}</h1>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                 {vacatures.length} {dashboard.werkgeversPage.Dashboard.texts[0].status || "active"}
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
                                  components={dashboard?.components} 
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
                               <h3 className="mt-2 text-sm font-medium text-gray-900">{dashboard.werkgeversPage.Dashboard.texts[0].notFound}</h3>
                              <p className="mt-1 text-sm text-gray-500">{dashboard.werkgeversPage.Dashboard.texts[0].emptyDescription || "There are currently no vacancies published."}</p>
                            </div>
                          )}
                        </div>

                         {/* Published Shifts Section */}
                         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                           <div className="flex items-center justify-between mb-6">
                             <h1 className="text-3xl font-bold text-gray-900">{dashboard.werkgeversPage.Dashboard.texts[1].name}</h1>
                             <div className="flex items-center space-x-2">
                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                 {shift.length} {dashboard.werkgeversPage.Dashboard.texts[1].status || "active"}
                               </span>
                             </div>
                           </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {shift.map((shiftItem, index) => (
                              <ShiftCard 
                                key={index} 
                                shift={shiftItem} 
                                components={undefined} 
                                lang={'at'} 
                              />
                            ))}
                          </div>
                        </div>

                         {/* Unpublished Shifts Section */}
                         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                           <div className="flex items-center justify-between mb-6">
                             <h1 className="text-3xl font-bold text-gray-900">{dashboard.werkgeversPage.Dashboard.texts[3].name}</h1>
                             <div className="flex items-center space-x-2">
                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                 {unpublished.length} {dashboard.werkgeversPage.Dashboard.texts[3].status || "draft"}
                               </span>
                             </div>
                           </div>
                          
                          {unpublished.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {unpublished.map((unpublishedItem, index) => (
                                <ShiftCard 
                                  key={index} 
                                  shift={unpublishedItem} 
                                  components={undefined} 
                                  lang={'at'} 
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
                               <h3 className="mt-2 text-sm font-medium text-gray-900">{dashboard.werkgeversPage.Dashboard.texts[3].notFound}</h3>
                               <p className="mt-1 text-sm text-gray-500">{dashboard.werkgeversPage.Dashboard.texts[3].emptyDescription || "There are currently no unpublished shifts."}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-12">
                        {/* Stats Bar */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                          <div className="grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="bg-white px-4 py-6 sm:px-6 lg:px-8">
                              <p className="text-sm/6 font-medium text-gray-500">{dashboard.werkgeversPage.Dashboard.statistics?.totalShifts || "Active Shifts"}</p>
                              <p className="mt-2 flex items-baseline gap-x-2">
                                <span className="text-4xl font-semibold tracking-tight text-gray-900">{activeShifts.length}</span>
                              </p>
                            </div>
                            <div className="bg-white px-4 py-6 sm:px-6 lg:px-8">
                              <p className="text-sm/6 font-medium text-gray-500">{dashboard.werkgeversPage.Dashboard.statistics?.activeVacancies || "Active Vacancies"}</p>
                              <p className="mt-2 flex items-baseline gap-x-2">
                                <span className="text-4xl font-semibold tracking-tight text-gray-900">{vacatures.length}</span>
                              </p>
                            </div>
                            <div className="bg-white px-4 py-6 sm:px-6 lg:px-8">
                              <p className="text-sm/6 font-medium text-gray-500">{dashboard.werkgeversPage.Dashboard.statistics?.pendingCheckouts || "Pending Checkouts"}</p>
                              <p className="mt-2 flex items-baseline gap-x-2">
                                <span className="text-4xl font-semibold tracking-tight text-gray-900">{checkout.length}</span>
                              </p>
                            </div>
                            <div className="bg-white px-4 py-6 sm:px-6 lg:px-8">
                              <p className="text-sm/6 font-medium text-gray-500">{dashboard.werkgeversPage.Dashboard.statistics?.totalInvoices || "Total Invoices"}</p>
                              <p className="mt-2 flex items-baseline gap-x-2">
                                <span className="text-4xl font-semibold tracking-tight text-gray-900">{factuur.length}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Vacancies Section - Empty State */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">{dashboard.werkgeversPage.Dashboard.texts[0].name}</h1>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                0 {dashboard.werkgeversPage.Dashboard.texts[1].status || "active"}
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
                                  components={dashboard?.components} 
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
                               <h3 className="mt-2 text-sm font-medium text-gray-900">{dashboard.werkgeversPage.Dashboard.texts[0].notFound}</h3>
                              <p className="mt-1 text-sm text-gray-500">{dashboard.werkgeversPage.Dashboard.texts[0].emptyDescription || "There are currently no vacancies published."}</p>
                            </div>
                          )}
                        </div>

                       
                        {/* Empty Shifts State */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">{dashboard.werkgeversPage.Dashboard.texts[1].name}</h1>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                0 {dashboard.werkgeversPage.Dashboard.texts[1].status || "active"}
                              </span>
                            </div>
                          </div>
                          <div className="text-center py-12">
                            <div className="mx-auto h-12 w-12 text-gray-400">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">{dashboard.werkgeversPage.Dashboard.texts[1].notFound}</h3>
                            <p className="mt-1 text-sm text-gray-500">{dashboard.werkgeversPage.Dashboard.texts[1].emptyDescription || "There are currently no shifts published."}</p>
                          </div>
                        </div>
                      </div>
                    )
                  ) : null
                } 

              {position === 'Checkouts' ? 
              checkout.length > 0 ? (
                <ScrollArea>
                  <h1 className='mb-10 items-center justify-center text-4xl'>{dashboard.werkgeversPage.Dashboard.texts[2].name}</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {checkout.slice(0, 9).map((checkoutItem, index) => (
                      <Card key={index} shift={checkoutItem} components={dashboard.components}/>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="lg:pl-96 h-full overflow-hidden"> {dashboard.werkgeversPage.Dashboard.texts[2].notFound} </div>
              ): null 
              }


              {position === 'Facturen' ? 
              factuur.length > 0 ? (
                <div className="space-y-8">
                  {/* Budget Button */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Budget Management</h3>
                        <p className="text-sm text-gray-500">
                          {activeBudget ? 'Manage your current budget' : 'Set up a budget to track your spending'}
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowBudgetForm(true)}
                        disabled={budgetLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        {budgetLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            {activeBudget ? 'Edit Budget' : 'Create Budget'}
                          </>
                        )}
                      </Button>
                    </div>
                    {activeBudget && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-900">{activeBudget.name}</p>
                            <p className="text-xs text-blue-700">
                              {activeBudget.budgetAmount.currency} {activeBudget.budgetAmount.total.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                              {activeBudget.budgetAmount.isPercentage && ` (${activeBudget.budgetAmount.percentage}% of revenue)`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-blue-900">
                              {activeBudget.budgetAmount.currency} {activeBudget.spending.total.toLocaleString('nl-NL', { minimumFractionDigits: 2 })} spent
                            </p>
                            <p className="text-xs text-blue-700">
                              {((activeBudget.spending.total / activeBudget.budgetAmount.total) * 100).toFixed(1)}% utilized
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Financial Stats Bar */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
                        <dt className="text-sm/6 font-medium text-gray-500">Revenue</dt>
                        <dd className="text-xs font-medium text-gray-700">+4.75%</dd>
                        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">€{factuur.reduce((sum, invoice) => sum + (invoice.totaalbedrag || 0), 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</dd>
                      </div>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
                        <dt className="text-sm/6 font-medium text-gray-500">Overdue invoices</dt>
                        <dd className="text-xs font-medium text-rose-600">+54.02%</dd>
                        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">€{Math.round(factuur.reduce((sum, invoice) => sum + (invoice.totaalbedrag || 0), 0) * 0.15).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</dd>
                      </div>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
                        <dt className="text-sm/6 font-medium text-gray-500">Outstanding invoices</dt>
                        <dd className="text-xs font-medium text-gray-700">-1.39%</dd>
                        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">€{Math.round(factuur.reduce((sum, invoice) => sum + (invoice.totaalbedrag || 0), 0) * 0.8).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</dd>
                      </div>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
                        <dt className="text-sm/6 font-medium text-gray-500">Expenses</dt>
                        <dd className="text-xs font-medium text-rose-600">+10.18%</dd>
                        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">€{Math.round(factuur.reduce((sum, invoice) => sum + (invoice.totaalbedrag || 0), 0) * 0.25).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</dd>
                      </div>
                      <div 
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setShowBudgetForm(true)}
                      >
                        <dt className="text-sm/6 font-medium text-gray-500">Budget</dt>
                        <dd className="text-xs font-medium text-blue-600">
                          {activeBudget ? `${activeBudget.type.charAt(0).toUpperCase() + activeBudget.type.slice(1)}` : 'Not Set'}
                        </dd>
                        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
                          {activeBudget ? (
                            <div className="space-y-1">
                              <div className="text-2xl font-bold text-blue-600">
                                {activeBudget.budgetAmount.currency} {activeBudget.budgetAmount.total.toLocaleString('nl-NL', { minimumFractionDigits: 0 })}
                              </div>
                              <div className="text-sm text-gray-500">
                                {((activeBudget.spending.total / activeBudget.budgetAmount.total) * 100).toFixed(1)}% utilized
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-400">No Budget</div>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>

                <ScrollArea>
                  <h1 className='mb-10 items-center justify-center text-4xl'>{dashboard.werkgeversPage.Dashboard.texts[5].name}</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {factuur.slice(0, 9).map((factuurItem, index) => (
                        <FactuurCard key={index} factuur={factuurItem} components={dashboard.components}/>
                    ))}
                  </div>
                </ScrollArea>
                </div>
               ) : (
                <div className="space-y-8">
                  {/* Budget Button - Empty State */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Budget Management</h3>
                        <p className="text-sm text-gray-500">
                          {activeBudget ? 'Manage your current budget' : 'Set up a budget to track your spending'}
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowBudgetForm(true)}
                        disabled={budgetLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        {budgetLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            {activeBudget ? 'Edit Budget' : 'Create Budget'}
                          </>
                        )}
                      </Button>
                    </div>
                    {activeBudget && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-900">{activeBudget.name}</p>
                            <p className="text-xs text-blue-700">
                              {activeBudget.budgetAmount.currency} {activeBudget.budgetAmount.total.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                              {activeBudget.budgetAmount.isPercentage && ` (${activeBudget.budgetAmount.percentage}% of revenue)`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-blue-900">
                              {activeBudget.budgetAmount.currency} {activeBudget.spending.total.toLocaleString('nl-NL', { minimumFractionDigits: 2 })} spent
                            </p>
                            <p className="text-xs text-blue-700">
                              {((activeBudget.spending.total / activeBudget.budgetAmount.total) * 100).toFixed(1)}% utilized
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Financial Stats Bar - Empty State */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
                        <dt className="text-sm/6 font-medium text-gray-500">Revenue</dt>
                        <dd className="text-xs font-medium text-gray-700">+0.00%</dd>
                        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">€0.00</dd>
                      </div>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
                        <dt className="text-sm/6 font-medium text-gray-500">Overdue invoices</dt>
                        <dd className="text-xs font-medium text-rose-600">+0.00%</dd>
                        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">€0.00</dd>
                      </div>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
                        <dt className="text-sm/6 font-medium text-gray-500">Outstanding invoices</dt>
                        <dd className="text-xs font-medium text-gray-700">+0.00%</dd>
                        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">€0.00</dd>
                      </div>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8">
                        <dt className="text-sm/6 font-medium text-gray-500">Expenses</dt>
                        <dd className="text-xs font-medium text-rose-600">+0.00%</dd>
                        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">€0.00</dd>
                      </div>
                      <div 
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setShowBudgetForm(true)}
                      >
                        <dt className="text-sm/6 font-medium text-gray-500">Budget</dt>
                        <dd className="text-xs font-medium text-blue-600">
                          {activeBudget ? `${activeBudget.type.charAt(0).toUpperCase() + activeBudget.type.slice(1)}` : 'Not Set'}
                        </dd>
                        <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
                          {activeBudget ? (
                            <div className="space-y-1">
                              <div className="text-2xl font-bold text-blue-600">
                                {activeBudget.budgetAmount.currency} {activeBudget.budgetAmount.total.toLocaleString('nl-NL', { minimumFractionDigits: 0 })}
                              </div>
                              <div className="text-sm text-gray-500">
                                {((activeBudget.spending.total / activeBudget.budgetAmount.total) * 100).toFixed(1)}% utilized
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-400">No Budget</div>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>

                <div className="lg:pl-96 h-full overflow-hidden"> {dashboard.werkgeversPage.Dashboard.texts[5].notFound} </div> 
                </div>
              ): null 
              }


              {position === 'Flexpools' ?
              flexpool.length > 0 ? (
                <ScrollArea>
                  {/* <AlertDialog>
                        <AlertDialogTrigger className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          {dashboard.werkgeversPage.Dashboard.texts[6].modal?.title || "Create Flexpool"}
                        </AlertDialogTrigger>
                         <AlertDialogContent className="bg-white rounded-3xl shadow-2xl border-0 max-w-lg mx-4 overflow-hidden">
                             <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                                 <div className="flex items-center space-x-3">
                                     <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                         </svg>
                                     </div>
                                     <div>
                                         <AlertDialogTitle className="text-2xl font-bold text-white">{dashboard.werkgeversPage.Dashboard.texts[6].modal?.title}</AlertDialogTitle>
                                         <p className="text-blue-100 text-sm">{dashboard.werkgeversPage.Dashboard.texts[4].modal?.description || "Create a new flexpool for your team"}</p>
                                     </div>
                                 </div>
                             </div>
                             
                             <div className="p-6">
                                 <div className="text-gray-600">
                                     <div className="space-y-6">
                                         <div>
                                             <label className="block text-sm font-semibold text-gray-800 mb-3">
                                                 <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                 </svg>
                                                 {dashboard.werkgeversPage.Dashboard.texts[4].modal?.subTitle || "Flexpool Name"}
                                             </label>
                                             <Input 
                                                 type="text" 
                                                 placeholder={dashboard.werkgeversPage.Dashboard.texts[4].modal?.subTitle || "Enter flexpool name"} 
                                                 className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg font-medium" 
                                                 onChange={(e) => setNewFlexpoolTitle(e.target.value)} 
                                             />
                                             <p className="text-xs text-gray-500 mt-2">{dashboard.werkgeversPage.Dashboard.texts[4].modal?.description || "Choose a clear name for your flexpool"}</p>
                                         </div>
                                     </div>
                                </div>
                             </div>
                             
                             <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                                 <AlertDialogCancel className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 font-medium">
                                     {dashboard.werkgeversPage.Dashboard.texts[6].modal?.buttons[0]}
                                 </AlertDialogCancel>
                                 <AlertDialogAction 
                                     onClick={voegFlexpoolToe}
                                     className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium shadow-lg"
                                 >
                                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                     </svg>
                                     {dashboard.werkgeversPage.Dashboard.texts[6].modal?.buttons[1]}
                                 </AlertDialogAction>
                             </div>
                        </AlertDialogContent>
                    </AlertDialog> */}
                    <h1 className='mb-10 items-center justify-center text-4xl'>{dashboard.werkgeversPage.Dashboard.texts[4].name}</h1>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Add Flexpool Card */}
                    <AlertDialog>
                        <AlertDialogTrigger className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-blue-600 shadow-md transition-all hover:shadow-lg hover:bg-blue-700 hover:scale-105 md:min-h-[438px] cursor-pointer">
                          <div className="flex-center flex-grow bg-blue-600 text-white">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
                            <div className="flex gap-2">
                              <p className="p-semibold-14 w-full py-1 text-white line-clamp-2">
                                Create New Flexpool
                              </p>
                            </div>
                            <div>
                              <p className="p-semibold-14 w-full py-1 text-blue-100 line-clamp-2">
                                Add a new team
                              </p>
                            </div>
                            <div className="flex-between w-full">
                              <p className="p-medium-14 md:p-medium-16 text-white">
                                Click to create
                              </p>
                            </div>
                          </div>
                        </AlertDialogTrigger>
                         <AlertDialogContent className="bg-white rounded-3xl shadow-2xl border-0 max-w-lg mx-4 overflow-hidden">
                             <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                                 <div className="flex items-center space-x-3">
                                     <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                         </svg>
                                     </div>
                                     <div>
                                         <AlertDialogTitle className="text-2xl font-bold text-white">{dashboard.werkgeversPage.Dashboard.texts[6].modal?.title}</AlertDialogTitle>
                                         <p className="text-blue-100 text-sm">{dashboard.werkgeversPage.Dashboard.texts[4].modal?.description || "Create a new flexpool for your team"}</p>
                                     </div>
                                 </div>
                             </div>
                             
                             <div className="p-6">
                                 <div className="text-gray-600">
                                     <div className="space-y-6">
                                         <div>
                                             <label className="block text-sm font-semibold text-gray-800 mb-3">
                                                 <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                 </svg>
                                                 {dashboard.werkgeversPage.Dashboard.texts[4].modal?.subTitle || "Flexpool Name"}
                                             </label>
                                             <Input 
                                                 type="text" 
                                                 placeholder={dashboard.werkgeversPage.Dashboard.texts[4].modal?.subTitle || "Enter flexpool name"} 
                                                 className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg font-medium" 
                                                 onChange={(e) => setNewFlexpoolTitle(e.target.value)} 
                                             />
                                             <p className="text-xs text-gray-500 mt-2">{dashboard.werkgeversPage.Dashboard.texts[4].modal?.description || "Choose a clear name for your flexpool"}</p>
                                         </div>
                                     </div>
                                </div>
                             </div>
                             
                             <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 flex justify-end space-x-4 border-t border-gray-200">
                                 <AlertDialogCancel className="group relative px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-300 font-semibold text-sm min-w-[120px] flex items-center justify-center">
                                     <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                     </svg>
                                     {dashboard.werkgeversPage.Dashboard.texts[6].modal?.buttons[0]}
                                 </AlertDialogCancel>
                                 <AlertDialogAction 
                                     onClick={voegFlexpoolToe}
                                     className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-2xl hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 font-semibold text-sm min-w-[140px] flex items-center justify-center shadow-lg"
                                 >
                                     <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                     <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                     </svg>
                                     <span className="relative z-10">{dashboard.werkgeversPage.Dashboard.texts[6].modal?.buttons[1]}</span>
                                 </AlertDialogAction>
                             </div>
                        </AlertDialogContent>
                    </AlertDialog>
                    {flexpool.slice(0, 9).map((flexpoolItem, index) => (
                      <FlexpoolCard key={index} flexpool={flexpoolItem} components={dashboard.components}/>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="lg:pl-96 h-full overflow-hidden">
                  <AlertDialog>
                        <AlertDialogTrigger className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          {dashboard.werkgeversPage.Dashboard.texts[6].modal?.title}
                        </AlertDialogTrigger>
                         <AlertDialogContent className="bg-white rounded-3xl shadow-2xl border-0 max-w-lg mx-4 overflow-hidden">
                             <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                                 <div className="flex items-center space-x-3">
                                     <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                         <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                         </svg>
                                     </div>
                                     <div>
                                         <AlertDialogTitle className="text-2xl font-bold text-white">{dashboard.werkgeversPage.Dashboard.texts[6].modal?.title}</AlertDialogTitle>
                                         <p className="text-blue-100 text-sm">{dashboard.werkgeversPage.Dashboard.texts[4].modal?.description || "Create a new flexpool for your team"}</p>
                                     </div>
                                 </div>
                             </div>
                             
                             <div className="p-6">
                                 <div className="text-gray-600">
                                     <div className="space-y-6">
                                         <div>
                                             <label className="block text-sm font-semibold text-gray-800 mb-3">
                                                 <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                 </svg>
                                                 {dashboard.werkgeversPage.Dashboard.texts[4].modal?.subTitle || "Flexpool Name"}
                                             </label>
                                             <Input 
                                                 type="text" 
                                                 placeholder={dashboard.werkgeversPage.Dashboard.texts[4].modal?.subTitle || "Enter flexpool name"} 
                                                 className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg font-medium" 
                                                 onChange={(e) => setNewFlexpoolTitle(e.target.value)} 
                                             />
                                             <p className="text-xs text-gray-500 mt-2">{dashboard.werkgeversPage.Dashboard.texts[4].modal?.description || "Choose a clear name for your flexpool"}</p>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                             
                             <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                                 <AlertDialogCancel className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 font-medium">
                                     {dashboard.werkgeversPage.Dashboard.texts[6].modal?.buttons[0]}
                                 </AlertDialogCancel>
                                 <AlertDialogAction 
                                     onClick={voegFlexpoolToe}
                                     className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium shadow-lg"
                                 >
                                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                     </svg>
                                     {dashboard.werkgeversPage.Dashboard.texts[6].modal?.buttons[1]}
                                 </AlertDialogAction>
                             </div>
                         </AlertDialogContent>
                    </AlertDialog>
                   <div className="text-center py-16">
                     <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                       <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                       </svg>
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-2">{dashboard.werkgeversPage.Dashboard.texts[4].notFound || "No flexpools found"}</h3>
                     <p className="text-gray-500 mb-8">{dashboard.werkgeversPage.Dashboard.texts[4].modal?.emptyState || "Start by creating your first flexpool to organize your team"}</p>
                   </div>
                    </div>
              ): null 
              }
              </div>
        </main>


        {sidebarOpen || (
        <aside className="fixed inset-y-0 left-20 hidden lg:block lg:w-96 overflow-hidden border-r border-gray-200 px-4 py-6 lg:px-8">
        <div className="h-full py-2 px-2 items-stretch rounded-lg flex flex-col space-y-4">
          <div className="h-1/3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 flex flex-col overflow-hidden">
            <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 h-12 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-white font-semibold text-lg">{dashboard.werkgeversPage.Dashboard.texts[6].name || "Published Shifts"}</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
              <p className="text-xs text-blue-600 font-medium">{dashboard.werkgeversPage.Dashboard.texts[6].description || "Active shifts currently published"}</p>
            </div>
            <div className="flex-grow overflow-hidden">
            <ScrollArea className="h-full overflow-auto">
            {shift.map((shiftItem, index) => {
  return (
    <li key={index} className="col-span-1 flex rounded-lg shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-1 items-center justify-between p-4">
        <div className="flex-1 min-w-0">
          <a href={`/dashboard/shift/employer/${shiftItem._id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 block truncate">
            {shiftItem.title}
          </a>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {shiftItem.startingDate ? new Date(shiftItem.startingDate).toLocaleDateString(`${dashboard.werkgeversPage.Dashboard.texts[6].localDateString}`) : `${dashboard.werkgeversPage.Dashboard.texts[6].noDate}`}
            </p>
            <div className="flex space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {shiftItem.applications ? shiftItem.applications.length : 0} {dashboard.werkgeversPage.Dashboard.texts[6].attributes[0]}
              </span>
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {shiftItem.spots ?? 0} {dashboard.werkgeversPage.Dashboard.texts[6].attributes[1]}
              </span>
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {shiftItem.accepted ? shiftItem.accepted.length : 0} {dashboard.werkgeversPage.Dashboard.texts[6].attributes[2]}
              </span>
        </div>
      </div>
        </div>
        <div className="ml-4 flex-shrink-0">
        <Image
          src={shiftItem.image || "https://utfs.io/f/72e72065-b298-4ffd-b1a2-4d12b06230c9-n2dnlw.webp"}
            width={48}
            height={48}
          alt={shiftItem.employerName || "shift"}
            className="object-cover rounded-full border-2 border-gray-200"
        />
        </div>
      </div>
    </li>
  );
})}

              </ScrollArea>
            </div>
          </div>
      
          <div className="h-1/3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg border border-green-200 flex flex-col overflow-hidden">
            <div className="w-full bg-gradient-to-r from-green-600 to-green-700 h-12 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white font-semibold text-lg">{dashboard.werkgeversPage.Dashboard.texts[7].name || "Checkouts"}</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-green-50 border-b border-green-200">
              <p className="text-xs text-green-600 font-medium">{dashboard.werkgeversPage.Dashboard.texts[7].description || "Pending checkouts awaiting approval"}</p>
            </div>
            <div className="flex-grow overflow-hidden">
            <ScrollArea className="h-full overflow-auto">
                  {checkout.map((checkoutItem, index) => (
                    <li key={index} className="col-span-1 flex rounded-lg shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow duration-200 mb-2">
                      <div className="flex flex-1 items-center justify-between p-4">
                      <div className="flex-1 min-w-0">
                         
                      <div className="flex justify-between">
                      <a href={`/dashboard/checkout/employer/${checkoutItem._id}`} className="font-medium text-gray-900 hover:text-gray-600">
                        {checkoutItem.titel}
                      </a>
                      <p className="text-gray-500">{dashboard.werkgeversPage.Dashboard.texts[7].attributes[0].currencySign}{checkoutItem?.uurtarief}</p>
                      </div>
                      <p className="text-gray-500">
                        {checkoutItem?.begindatum ? new Date(checkoutItem.begindatum).toLocaleDateString(`${dashboard.werkgeversPage.Dashboard.texts[7].localDateString}`) : `${dashboard.werkgeversPage.Dashboard.texts[7].noDate}`}
                        </p>
                        <div className="flex justify-between">
                        <p className="text-gray-500">
                        {checkoutItem?.begintijd || 'Begintijd'} - {checkoutItem?.eindtijd || 'Eindtijd'}
                        </p>
                        <p className="text-gray-500">{checkoutItem?.pauze || 'Pauze'} {dashboard.werkgeversPage.Dashboard.texts[7].attributes[2]}</p>
                        </div>
                        <div className="flex justify-between">
                        <p>
                        {checkoutItem?.checkoutbegintijd || 'Begintijd'} - {checkoutItem?.checkouteindtijd || 'Eindtijd'}
                        </p>
                        <p>{checkoutItem?.checkoutpauze || '0'} {dashboard.werkgeversPage.Dashboard.texts[7].attributes[2]}</p>
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
                          {dashboard.werkgeversPage.Dashboard.texts[7].buttons[0]}
                        </button>         
                        <button onClick={() => handleCheckoutAcceptance(checkoutItem._id)}
                       className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {dashboard.werkgeversPage.Dashboard.texts[7].buttons[1]}
                        </button> 
                        </div> 
                      </div>
                      </div>
                    </li>
                  ))}
                </ScrollArea>               
            </div>
          </div>
      
          <div className="h-1/3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg border border-purple-200 flex flex-col overflow-hidden">
            <div className="w-full bg-gradient-to-r from-purple-600 to-purple-700 h-12 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-white font-semibold text-lg">{dashboard.werkgeversPage.Dashboard.texts[8].name || "Invoices"}</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-purple-50 border-b border-purple-200">
              <p className="text-xs text-purple-600 font-medium">{dashboard.werkgeversPage.Dashboard.texts[8].description || "Weekly invoices and payment summaries"}</p>
            </div>
            <div className="flex-grow overflow-hidden">
              <ScrollArea className="h-full overflow-auto">
                {factuur.map((factuurItem, index) => (
                  <li key={index} className="col-span-1 flex rounded-lg shadow-sm bg-white border border-gray-100 hover:shadow-md transition-shadow duration-200 mb-2">
                     <div className="flex flex-1 items-center justify-between p-4">
                      <div className="flex-1 min-w-0">
                        <a href={`/dashboard/invoice/employer/${factuurItem._id}`} className="font-medium text-gray-900 hover:text-gray-600">
                          Week {factuurItem.number} 
                        </a>
                        {factuurItem.shifts?.length === 1 ? (
                   <>
               <p className="text-gray-500">
                 {factuurItem.shifts?.length} {dashboard.werkgeversPage.Dashboard.texts[8].attributes[0]} 
               </p>
             </>
            ) : (
              <p className="text-gray-500">
                {factuurItem.shifts?.length} {dashboard.werkgeversPage.Dashboard.texts[8].attributes[1]}
              </p>
            )}
                        <div className="flex flex-1 items-center justify-between">
                        <p className="text-gray-500">{dashboard.werkgeversPage.Dashboard.texts[8].attributes[4].currencySign}{factuurItem.amount || 0} </p>
                        {factuurItem.status === 'paid' ? (
                        <p className="text-green-600">{dashboard.werkgeversPage.Dashboard.texts[8].attributes[2]}</p>
                        ) : (
                          <p className="text-gray-500">{dashboard.werkgeversPage.Dashboard.texts[8].attributes[3]}</p>
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
    <UitlogModal 
      isVisible={showLogOut} 
      onClose={() => setShowLogOut(false)} 
      components={{
        shared: {
          UitlogModal: {
            headtitle: "Uitloggen",
            subTitle: "Weet je zeker dat je wilt uitloggen?",
            buttons: ["Annuleren", "Uitloggen"]
          }
        }
      }}
    />
    <Checkoutgegevens  
      shiftId={checkoutId} 
      isVisible={showCheckout} 
      onClose={() => setShowCheckout(false)} 
      lang={lang}
      components={{
        shared: {
          CheckoutModal: {
            headtitle: "Checkout",
            subTitle: "Checkout details",
            buttons: ["Annuleren", "Accepteren", "Weigeren"]
          }
        }
      }}
    />
    
    {/* ChatBot Icon - Fixed to bottom right - Hidden when chat is open */}
    {!showChat && <ChatBotIcon onClick={() => setShowChat(!showChat)} />}
    
    {/* ChatScreen - Conditional rendering */}
    {showChat && (
      <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
        <div className="w-full max-w-lg h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Modern Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">AI Assistant</h3>
                  <p className="text-blue-100 text-sm">Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Chat Content */}
          <div className="h-[520px] flex flex-col">
            <ChatScreen />
          </div>
        </div>
      </div>
    )}

    {/* Enhanced Budget Form Modal */}
    {showBudgetForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <EnhancedBudgetForm
            employerId={bedrijfiD}
            onClose={() => setShowBudgetForm(false)}
            onSuccess={(budget) => {
              setActiveBudget(budget);
              setShowBudgetForm(false);
              // Refresh budget data
              const fetchActiveBudget = async () => {
                try {
                  const updatedBudget = await getActiveBudget(bedrijfiD);
                  setActiveBudget(updatedBudget);
                } catch (error) {
                  console.error('Error fetching active budget:', error);
                }
              };
              fetchActiveBudget();
            }}
            existingBudget={activeBudget}
          />
        </div>
      </div>
    )}
    </Fragment>
  )
}


export default Dashboard