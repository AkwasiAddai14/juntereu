"use client"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from '@heroicons/react/20/solid'
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from 'react'
import React from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameDay, parseISO } from 'date-fns'
import LeButton from '@/app/[lang]/components/dashboard/CompanyDashboard/Calender/LeButton';
import { IJob } from '@/app/lib/models/job.model';
import { haalDienstenFreelancer } from '@/app/lib/actions/vacancy.actions';
import { vindBeschikbaarheidVanFreelancer } from '@/app/lib/actions/availability.actions';
import { haalFreelancer } from '@/app/lib/actions/employee.actions';
import { haalAangemeld } from '@/app/lib/actions/shift.actions';
import { IAvailability } from '@/app/lib/models/availability.model';
import { IEmployee } from '@/app/lib/models/employee.model';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys




function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

const CalenderM = ({
  lang,
  dictionary
}: {
  lang: Locale;
  dictionary: any;
}) => {
  const { isLoaded, user } = useUser();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [shifts, setShifts] = useState<any[]>([]);
  const [ diensten, setDiensten ] = useState<IJob[]>([]);
  const [ beschikbaarheid, setBeschikbaarheid ] = useState<IAvailability[]>([])
  const [freelancer, setFreelancer] = useState<IEmployee>();
  const { dashboard } = dictionary;

  useEffect(() => {
    if (isLoaded && user) {
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
      if (user) {  // Only fetch if user exists and freelancerId is not already set
        getFreelancerId();
      }
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchAangemeldeShifts = async () => {
      try {
            const response = await haalAangemeld(freelancer!.id);
            if (response) {
              // Filter and separate shifts based on their status
              const geaccepteerdShifts = response.filter((shift: { status: string; }) => shift.status === 'aangenomen');
              
              // Set the state with the filtered shifts
              setShifts(geaccepteerdShifts);
            
            } else {
              // If no response or not an array, default to empty arrays
              setShifts([]);
           
            }
        
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };
    fetchAangemeldeShifts();  // Call the fetchShifts function
  }, [freelancer!.id]); 

  

  useEffect(() => {
    if (freelancer) {  // Only fetch shifts if bedrijfId is available
      const fetchAvailability = async () => {
        try {
          const availability = await vindBeschikbaarheidVanFreelancer(freelancer.id);
          setBeschikbaarheid(availability || []);  // Ensure shifts is always an array
        } catch (error) {
          console.error('Error fetching shifts:', error);
          setBeschikbaarheid([]);  // Handle error by setting an empty array
        }
      };
  
      fetchAvailability();
    }
  }, [freelancer!.id]); 

  useEffect(() => {
    if (freelancer) {  // Only fetch shifts if bedrijfId is available
      const fetchDiensten = async () => {
        try {
          const diensten = await haalDienstenFreelancer(freelancer.id);
          setDiensten(diensten || []);  // Ensure shifts is always an array
        } catch (error) {
          console.error('Error fetching diensten:', error);
          setDiensten([]);  // Handle error by setting an empty array
        }
      };
  
      fetchDiensten();
    }
  }, [freelancer!.id]); 

  const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
  const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })

  interface Day {
    date: string;
    isCurrentMonth: boolean;
    isToday?: boolean;
    isSelected?: boolean;
    events: Event[];
  }

  interface Event {
    id: string;
    name: string;
    begintijd: string;
    eindtijd: string;
    datetime: string;
    href: string;
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  
  const days: Day[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push({
      date: format(day, 'yyyy-MM-dd'),
      isCurrentMonth: day.getMonth() === currentMonth.getMonth(),
      isToday: format(day, 'yyyy-MM-dd') === today,
      isSelected: false,
      events: [], // This is now typed as Event[]
    });
    day = addDays(day, 1);
  }

days.forEach((day) => {
  const dayDate = new Date(day.date);

  shifts.forEach((shift) => {
    const shiftDate = new Date(shift.startingDate);
    if (
      shiftDate.getFullYear() === dayDate.getFullYear() &&
      shiftDate.getMonth() === dayDate.getMonth() &&
      shiftDate.getDate() === dayDate.getDate()
    ) {
      day.events.push({
        id: shift._id as string,
        name: shift.title,
        begintijd: shift.starting,
        eindtijd: shift.ending,
        datetime: shift.startingDate.toISOString(),
        href: `/dashboard/shift/bedrijf/${shift._id}`,
      })
    }
  })

  diensten.forEach((dienst) => {
    const shiftDate = new Date(dienst.date);
    if (
      shiftDate.getFullYear() === dayDate.getFullYear() &&
      shiftDate.getMonth() === dayDate.getMonth() &&
      shiftDate.getDate() === dayDate.getDate()
    ) {
      day.events.push({
        id: dienst._id as string,
        name: dienst.title,
        begintijd: dienst.workingtime.starting,
        eindtijd: dienst.workingtime.ending,
        datetime: dienst.date.toString(),
        href: `/dashboard/vacature/pagina/${dienst.vacancy}`,
      })
    }
  });

  beschikbaarheid.forEach((item, index) => {
    const dienstDate = new Date(item.data[index].startingDate);
    if (
      dienstDate.getFullYear() === dayDate.getFullYear() &&
      dienstDate.getMonth() === dayDate.getMonth() &&
      dienstDate.getDate() === dayDate.getDate()
    ) {
      day.events.push({
        id: item._id as string,
        name: item.employee.employeeFirstname,
        begintijd: item.data[index].startingTime,
        eindtijd: item.data[index].endingTime,
        datetime: new Date(item.data[index].startingDate).toISOString(),
        href: `/`,
      });
    }
  });
});

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDateClick = (date: Date) => {
    const selectedDayObject = days.find((day) => isSameDay(parseISO(day.date), date));
    setSelectedDay(selectedDayObject || null); // Set the selected day object or null
  };

  const selectedDayObject = days.find((day) => day.isSelected);

  return (
    <div className="lg:flex lg:pl-96 md:w-auto lg:w-auto lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time dateTime={format(currentMonth, 'MM-yyyy')}>{format(currentMonth, 'MMMM yyyy')}</time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              onClick={handlePrevMonth}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
              onClick={handleNextMonth}
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          <div className="bg-white py-2">
            M<span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className="bg-white py-2">
            W<span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className="bg-white py-2">
            F<span className="sr-only sm:not-sr-only">ri</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">at</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">un</span>
          </div>
        </div>
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {days.map((day) => (
              <div
                key={day.date}
                className={classNames(
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500',
                  'relative px-3 py-2',
                )}
              >
                <time
                  dateTime={day.date}
                  className={
                    day.isToday
                      ? 'flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 font-semibold text-white'
                      : undefined
                  }
                >
                  {(day.date.split('-').pop() ?? '').replace(/^0/, '')}
                </time>
                {day.events.length > 0 && (
                  <ol className="mt-2">
                    {day.events.slice(0, 2).map((event) => (
                      <li key={event.id}>
                        <a href={event.href} className="group flex">
                          <p className="flex-auto truncate font-small text-gray-900 group-hover:text-sky-600">
                          {event.begintijd} - {event.eindtijd}
                          </p>
                          <time
                            dateTime={event.datetime}
                            className="ml-3 hidden flex-none text-gray-500 group-hover:text-sky-600 xl:block"
                          >
                            {event.datetime}
                          </time>
                        </a>
                      </li>
                    ))}
                    {day.events.length > 2 && <li className="text-gray-500">+ {day.events.length - 2} more</li>}
                  </ol>
                )}
              </div>
            ))}
          </div>
          <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
            {days.map((day) => (
              <button
                key={day.date}
                type="button"
                className={classNames(
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  (day.isSelected || day.isToday) && 'font-semibold',
                  day.isSelected && 'text-white',
                  !day.isSelected && day.isToday && 'text-sky-600',
                  !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900',
                  !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-500',
                  'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10',
                )}
                onClick={() => handleDateClick(new Date(day.date))}
              >
                <time
                  dateTime={day.date}
                  className={classNames(
                    day.isSelected && 'flex h-6 w-6 items-center justify-center rounded-full',
                    day.isSelected && day.isToday && 'bg-sky-600',
                    day.isSelected && !day.isToday && 'bg-gray-900',
                    'ml-auto',
                  )}
                >
                  {(day.date.split('-').pop() ?? '').replace(/^0/, '')}
                </time>
                <span className="sr-only">{day.events.length} events</span>
                {day.events.length > 0 && (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    {day.events.map((event) => (
                      <span key={event.id} className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400" />
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {selectedDay && selectedDay.events.length > 0 && (
        <div className="px-4 py-10 sm:px-6 lg:hidden">
          <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
            {selectedDay.events.map((event) => (
              <li key={event.id} className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
                <div className="flex-auto">
                  <p className="font-semibold text-gray-900">{event.name}</p>
                  <time dateTime={event.datetime} className="mt-2 flex items-center text-gray-700">
                    <ClockIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    {event.begintijd} - {event.eindtijd}
                  </time>
                </div>
                <LeButton link={event.href} buttonText="Wijzig" />
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export default CalenderM
