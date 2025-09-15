"use client"

import { Fragment } from 'react';
import React from 'react';
import { ChevronDownIcon, EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { Menu, Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { format } from 'date-fns';
import Dag from '@/app/[lang]/components/dashboard/CompanyDashboard/Calender/Wrappers/DagWrapper';
import Week from '@/app/[lang]/components/dashboard/CompanyDashboard/Calender/Wrappers/WeekWrapper';
import Maand from '@/app/[lang]/components/dashboard/CompanyDashboard/Calender/Wrappers/MaandWrapper';
import Jaar from '@/app/[lang]/components/dashboard/CompanyDashboard/Calender/Wrappers/JaarWrapper';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];



function classNames(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ')
  }

  const navigation = [
    {name: 'Dag', value: 'Dag'},
    { name: 'Week', value: 'Week'},
    { name: 'Maand', value: 'Maand' },
    { name: 'Jaar', value: 'Jaar' },
  ]

const Calender =({ dashboard, lang }: { dashboard: any, lang: Locale }) => {
    const [position, setPosition] = React.useState("Maand");
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const router = useRouter()
    
      useEffect(() => {
        const intervalId = setInterval(() => {
          setCurrentDate(new Date());
        }, 1000);
    
        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
      }, []);


  return (
    <>
    <div className="flex flex-none lg:pl-96 md:w-auto md:pl-0 sm:pl-0 lg:w-auto">
      <header className="items-center justify-between flex flex-1 min-w-0 md:w-auto md:pl-0 sm:pl-0 lg:w-auto border-b border-gray-200 px-6 py-4">
      <div>
      <h1 className="text-base font-semibold leading-6 text-gray-900">
        <time dateTime={format(currentDate, 'dd-MM-yyyy')} className="sm:hidden">
          {format(currentDate, 'PPpp')}
        </time>
        <time dateTime={format(currentDate, 'dd-MM-yyyy')} className="hidden sm:inline">
          {format(currentDate, 'MMMM d, yyyy')}
        </time>
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {format(currentDate, 'EEEE')}
      </p>
    </div>
    <div className="flex items-center">
      <div className="hidden md:ml-4 md:flex md:items-center">
      <Menu as="div" className="relative">
              <Menu.Button
                type="button"
                className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                {position}
                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                  <Menu.Item>
                      {({ active }) => (
                        <button
                        key={'Week'}
                        onClick={() => setPosition('Dag')}
                        className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                        )}
                      >
                        <span className="sr-only">Dag</span>
                        {dashboard.werkgeversPage.Calender.calender.navigation[0].name}
                      </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                        key={'Week'}
                        /* onClick={() => setPosition('Week')} */
                        className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                        )}
                      >
                        <span className="sr-only">Week</span>
                        {dashboard.werkgeversPage.Calender.calender.navigation[1].name}
                      </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                        key={'Maand'}
                        onClick={() => setPosition('Maand')}
                        className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                        )}
                      >
                        <span className="sr-only">Maand</span>
                        {dashboard.werkgeversPage.Calender.calender.navigation[2].name}
                      </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                        key={'Jaar'}
                        onClick={() => setPosition('Jaar')}
                        className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                        )}
                      >

                        <span className="sr-only">Jaar</span>
                        {dashboard.werkgeversPage.Calender.calender.navigation[3].name}
                      </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              className="ml-6 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              onClick={() => router.push("../dashboard/shift/maak")}
            >
              {dashboard.werkgeversPage.Calender.calender.buttons[0]}
            </button>
            <button
              type="button"
              className="ml-6 rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              onClick={() => router.push("../dashboard/vacature/maak")}
            >
               {dashboard.werkgeversPage.Calender.calender.buttons[1]}
            </button>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="../dashboard/shift/maak"
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                         {dashboard.werkgeversPage.Calender.calender.buttons[0]}
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                         {dashboard.werkgeversPage.Calender.calender.buttons[3]}
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                <Menu.Item>
                    {({ active }) => (
                      <button
                      key={"Dag"}
                      onClick={() => setPosition("Dag")}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                      )}
                    >
                      <span className="sr-only">Dag</span>
                      {dashboard.werkgeversPage.Calender.calender.navigation[0].name}
                    </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                      key={"Week"}
                      onClick={() => setPosition("Week")}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                      )}
                    >
                      <span className="sr-only">Week</span>
                      {dashboard.werkgeversPage.Calender.calender.navigation[1].name}
                    </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                      key={"Maand"}
                      onClick={() => setPosition("Maand")}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                      )}
                    >
                      <span className="sr-only">Maand</span>
                      {dashboard.werkgeversPage.Calender.calender.navigation[2].name}
                    </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                      key={"Jaar"}
                      onClick={() => setPosition("Jaar")}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                      )}
                    >
                      <span className="sr-only">Jaar</span>
                      {dashboard.werkgeversPage.Calender.calender.navigation[3].name}
                    </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
    </div>
  </header>
  </div>
  <div>
  {position === "Dag"  && (
<Dag lang={'en'}/>
    )
    }
{position === "Week"  && (
<Week lang={'en'}/>
    )
    }
    {position === "Maand"  && (
<Maand lang={'en'} />
    )
    }
    {position === "Jaar"  && (
<Jaar lang={'en'}/>
    )
    }
  </div>
  </>
  )
}

export default Calender;