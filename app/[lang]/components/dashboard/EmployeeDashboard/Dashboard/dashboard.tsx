"use client"


import * as React from "react";
import Image from 'next/image'; 
import { Fragment, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Disclosure,  DisclosureButton,  DisclosurePanel, Menu, MenuButton,  MenuItem,  MenuItems } from '@headlessui/react';
import Loading from "@/app/[lang]/components/dashboard/EmployeeDashboard/Dashboard/DashboardLoading";
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '@/app/assets/images/178884748_padded_logo.png';
import UitlogModal from "../../../shared/Wrappers/UitlogModal";
import BentoGrid from '../BentoGrid/BentoGrid';
import Calender from '../Calender/Wrappers/Calender';
import Explore from '../Explore/Explore';
import Shifts from '../Shifts/Shifts';
import Flexpool from "../Flexpool/page";
import Financien from '../Financien/Page';
import Profiel from '../Profiel/ProfileWrapper';
import FAQ from '../FAQ/FAQ';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


/* const navigation = [
  { name: 'Home', value: 'Home',  href: '#' , current: true},
  { name: 'Calender', value: 'Calender', href: '#' , current: false },
  { name: 'Shifts', value: 'Shifts', href: '#' , current: false },
  { name: 'Flexpools', value: 'Flexpools', href: '#' , current: false },
  { name: 'Financien', value: 'Financien', href: '#' , current: false },
];


const userNavigation = [
  { name: 'Profiel', value: 'Profiel', href: '#' },
  { name: 'Uitloggen', value: 'Uitloggen', href: '#' },
  { name: 'FAQ', value: 'FAQ', href: '#' },
] */





function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}



export default function EmployeeDashboard({ lang, dashboard }: { lang: Locale; dashboard: any }) {
  const { isLoaded, user } = useUser();
  const [position, setPosition] = React.useState("Shifts");
  const [showLogOut, setShowLogOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const navigation = dashboard.werknemersPage.Dashboard.navigation.map((item: {name: string, value: string}, index: number) => ({
    name: item.name,
    value: item.value,
    href: '#',          // voeg hier eventueel dynamisch routing aan toe
    current: index === 0, // bijv. eerste item actief
  }));

  const userNavigation = dashboard.werknemersPage.Dashboard.UserNavigation.map((item: {name: string, value: string}) => ({
    name: item.name,
    value: item.value,
    href: '#',
  }));
  
  useEffect(() => {
    if (isLoaded && user) {
      setIsLoading(false);
    }
  }, [isLoaded, user]);
  const MenuSluiten = (value: string) => {
    setPosition(value);
  }


  if(isLoading){
    return (
      <div>
       <Loading lang={"en"}/> 
      </div>
    )
  }

  return (
   <Fragment>
      <div className="min-h-full">
        <Disclosure as="nav" className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex shrink-0 items-center">
                  <Image 
                className="block h-8 w-auto lg:hidden"
                width={8}
                height={8} 
                src={logo} 
                alt="Junter logo" /> {/* Use Image component for optimized images */}
                <Image 
                className="hidden h-8 w-auto lg:block"
                width={8}
                height={8} 
                src={logo} 
                alt="Junter logo" /> {/* Use Image component for optimized images */}
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item: {name: string, value: string}) => (
                     <button
                     onClick={() => MenuSluiten(item.value)}
                     className={classNames(
                       position === item.value ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                       'group flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold'
                       )}
                       >
                     {item.name}
                   </button>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img alt="" src={user?.imageUrl} className="size-8 rounded-full" />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item: {name: string, value: string, href: string}) => (
                      
                      <Menu.Item key={item.name}>
                      {({ active }) => (
                        <a
                        href={item.href}
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                          )}
                          onClick={() => {
                            if (item.name === 'Uitloggen') {
                              setShowLogOut(true);
                            }
                          }}
                          >
                          {item.name}
                        </a>
                      )}
                    </Menu.Item>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item: {name: string, href: string, current: boolean}) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  className={classNames(
                    item.current
                      ? 'border-sky-500 bg-indigo-50 text-sky-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="shrink-0">
                  <img alt="" src={user?.imageUrl} className="size-10 rounded-full" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.firstName} {user?.lastName}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.emailAddresses[0].emailAddress}</div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                {userNavigation.map((item: {name: string, href: string}) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{dashboard.werknemersPage.Dashboard.headTitle}</h1>
            </div>
          </header>
          <main className={`${['Geaccepteerde shifts','Aanmeldingen', 'Checkouts', 'Facturen', 'Flexpools'].includes(position) ? 'xl:pl-0' : 'xl:pl-96'}`}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {/* Your content */}
              <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">{/* Main area */}
                    {
                    position === 'Home' ??
                     <BentoGrid lang={lang}/>
                    }
                    {
                    position === 'Explore' ??
                    <Explore lang={lang}/>
                    }
                    {
                    position === 'Calender' ??
                     <Calender lang={lang}/>
                    }
                    {
                    position === 'Shifts' ??
                    <Shifts lang={lang}/>
                    }
                    {
                    position === 'Financien' ??
                     <Financien lang={lang} />
                    }      
                    {
                    position === 'Flexpools' ??
                     <Flexpool lang={lang} />
                    } 
                    {
                    position === 'Profiel' ??
                     <Profiel lang={lang} />
                    }   
                    {
                    position === 'FAQ' ??
                     <FAQ lang={lang}/>
                    }   
            </div>
              </div>
          </main>
        </div>
      </div>
      <UitlogModal params={{
        lang: lang
      }} />
      </Fragment>
  )
}
