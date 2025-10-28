"use client"


import { CalendarDateRangeIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import {  ChevronDownIcon,  ClockIcon,  EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import { useUser } from "@clerk/nextjs";
import { Fragment, useEffect, useRef, useState } from 'react'
import React from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameDay, isSameMonth, parse, parseISO, eachDayOfInterval, getDay, startOfDay  } from 'date-fns'
import { IShiftArray } from '@/app/lib/models/shiftArray.model'
import { haalGeplaatsteShifts } from '@/app/lib/actions/shiftArray.actions';
import { fetchBedrijfByClerkId } from "@/app/lib/actions/employer.actions";
import { IJob } from '@/app/lib/models/job.model';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { haalDienstenFreelancer, haalGeplaatsteDiensten } from '@/app/lib/actions/vacancy.actions';
import LeButton from '@/app/[lang]/components/dashboard/CompanyDashboard/Calender/LeButton';
import { haalFreelancer } from '@/app/lib/actions/employee.actions';
import { vindBeschikbaarheidVanFreelancer } from '@/app/lib/actions/availability.actions';
import { haalAangemeld } from '@/app/lib/actions/shift.actions';
import { IAvailability } from '@/app/lib/models/availability.model';
import { IEmployee } from '@/app/lib/models/employee.model';
import { showErrorToast } from '@/app/[lang]/lib/errorHandler';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

const generateYearCalendar = (year: number): { name: string; days: Day[]; startDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6}[] => {
  const months = [];
  const today = startOfDay(new Date());

  for (let month = 0; month < 12; month++) {
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(start);
    let startDayOfWeek = getDay(start) as 0 | 1 | 2 | 3 | 4 | 5 | 6;

    startDayOfWeek = (startDayOfWeek === 0 ? 6 : startDayOfWeek - 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    
    const days: Day[] = eachDayOfInterval({ start, end }).map(date => {
      const isToday = date.getTime() === today.getTime();
      return {
        date: format(date, 'yyyy-MM-dd'),
        isCurrentMonth: date.getMonth() === month,
        isToday,
        isSelected: false,
        events: [] // Initialize events as an empty array
      };
    });

    months.push({
      name: format(start, 'MMMM'),
      days,
      startDayOfWeek,
    });
  }
  return months;
};

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
  
}

interface Props {
  lang: string;
  dashboard: any;
}

export default function Example({ lang, dashboard }: Props) {
  const { isLoaded, user } = useUser();
  const [year, setYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [months, setMonths] = useState(generateYearCalendar(year));
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [shifts, setShifts] = useState<any[]>([]);
  const [ diensten, setDiensten ] = useState<IJob[]>([]);
  const [ beschikbaarheid, setBeschikbaarheid ] = useState<IAvailability[]>([])
  const [freelancer, setFreelancer] = useState<IEmployee>();

  const today = format(new Date(), 'yyyy-MM-dd');
  const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
  const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })

  console.log(selectedDay)
  
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
    const dayDate = new Date(day.date).setHours(0, 0, 0, 0); // Normalize day date to remove time
    const daytDate = new Date(day.date);

    shifts.forEach((shift) => {
      const shiftDate = new Date(shift.startingDate).setHours(0, 0, 0, 0); // Normalize shift date to remove time
     
      if (dayDate === shiftDate) {
        console.log("Match Found:", new Date(dayDate).toDateString()); // Debug: confirm match found
        day.events.push({
          id: shift._id as string,
          name: shift.title,
          begintijd: shift.starting,
          eindtijd: shift.ending,
          datetime: shift.startingDate.toISOString(),
         
        });
      }
    });

    diensten.forEach((dienst) => {
      const shiftDate = new Date(dienst.date).setHours(0, 0, 0, 0); // Normalize shift date to remove time
     
      if (dayDate === shiftDate) {
        console.log("Match Found:", new Date(dayDate).toDateString()); // Debug: confirm match found
        day.events.push({
          id: dienst._id as string,
          name: dienst.title,
          begintijd: dienst.workingtime.starting,
          eindtijd: dienst.workingtime.ending,
          datetime: dienst.date.toString(),
         
        });
      }
    });

    beschikbaarheid.forEach((item, index) => {
      const dienstDate = new Date(item.data[index].startingDate);
      if (dienstDate.getFullYear() === daytDate.getFullYear() &&
      dienstDate.getMonth() === daytDate.getMonth() &&
      dienstDate.getDate() === daytDate.getDate()) {
        day.events.push({
          id: item._id as string,
          name: item.employee.employeeFirstname,
          begintijd: item.data[index].startingTime,
          eindtijd: item.data[index].endingTime,
          datetime: new Date(item.data[index].startingDate).toISOString(),
         
        });
      }
    });

  });

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
    if (!freelancer?.id) return; // Guard clause: don't run if freelancer is undefined
    
    const fetchAangemeldeShifts = async () => {
      try {
            const response = await haalAangemeld(freelancer.id);
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
        showErrorToast("Failed to load shifts. Please try again.");
        setShifts([]);
      }
    };
    fetchAangemeldeShifts();  // Call the fetchShifts function
  }, [freelancer?.id]); 

  

  useEffect(() => {
    if (freelancer) {  // Only fetch shifts if bedrijfId is available
      const fetchAvailability = async () => {
        try {
          const availability = await vindBeschikbaarheidVanFreelancer(freelancer.id);
          setBeschikbaarheid(availability || []);  // Ensure shifts is always an array
        } catch (error) {
          showErrorToast("Failed to load availability. Please try again.");
          setBeschikbaarheid([]);  // Handle error by setting an empty array
        }
      };
  
      fetchAvailability();
    }
  }, [freelancer?.id]); 

  useEffect(() => {
    if (freelancer) {  // Only fetch shifts if bedrijfId is available
      const fetchDiensten = async () => {
        try {
          const diensten = await haalDienstenFreelancer(freelancer.id);
          setDiensten(diensten || []);  // Ensure shifts is always an array
        } catch (error) {
          showErrorToast("Failed to load services. Please try again.");
          setDiensten([]);  // Handle error by setting an empty array
        }
      };
  
      fetchDiensten();
    }
  }, [freelancer?.id]); 

    // Add events to days within the appropriate months
    useEffect(() => {
      const updatedMonths = generateYearCalendar(year); // Generate fresh calendar
      updatedMonths.forEach((month) => {
        month.days.forEach((day) => {
          const dayDate = new Date(day.date).setHours(0, 0, 0, 0); // Normalize day date to remove time
    
          shifts.forEach((shift) => {
            const shiftDate = new Date(shift.startingDate).setHours(0, 0, 0, 0); // Normalize shift date to remove time
    
            if (dayDate === shiftDate) {
              day.events.push({
                id: shift._id as string,
                name: shift.title,
                begintijd: shift.starting,
                eindtijd: shift.ending,
                datetime: shift.startingDate.toISOString(),
               
              });
            }
          });


          diensten.forEach((dienst) => {
            const shiftDate = new Date(dienst.date).setHours(0, 0, 0, 0); // Normalize shift date to remove time
    
            if (dayDate === shiftDate) {
              day.events.push({
                id: dienst._id as string,
                name: dienst.title,
                begintijd: dienst.workingtime.starting,
                eindtijd: dienst.workingtime.ending,
                datetime: dienst.date.toString(),
              });
            }
          });


        });
      });
  
      setMonths(updatedMonths); // Update the state with the full year
    }, [shifts, year]);

  useEffect(() => {
    setMonths(generateYearCalendar(year));
  }, [year]);

  const handlePreviousYear = () => {
    setYear(prevYear => prevYear - 1);
  };

  const handleNextYear = () => {
    setYear(prevYear => prevYear + 1);
  };

  const handleDateClick = (date: Date) => {
    const selectedDayObject = months
      .flatMap(month => month.days)
      .find(day => isSameDay(parseISO(day.date), date));
  
    setSelectedDay(selectedDayObject || null);
  };

  // Show loading state when freelancer is not yet loaded
  if (!freelancer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading calendar...</p>
          <p className="mt-1 text-sm text-gray-500">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white w-full">
        <div className="flex items-center justify-between p-4">
          <button onClick={handlePreviousYear}>
            <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{year}</h2>
          <button onClick={handleNextYear}>
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-16 px-4 py-16 sm:grid-cols-2 sm:px-6 xl:max-w-none xl:grid-cols-3 xl:px-8 2xl:grid-cols-4">
          {months.map((month) => (
            <section key={month.name} className="text-center">
              <h2 className="text-sm font-semibold text-gray-900">{month.name}</h2>
              <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
                <div>S</div>
              </div>
              <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
                {/* Add empty cells before the start of the month */}
                {Array.from({ length: month.startDayOfWeek }).map((_, index) => (
                  <div key={index} className="bg-gray-50 text-gray-400 py-1.5" />
                ))}
                   {month.days.map((day, dayIdx) => {
  const hasEvents = day.events.length > 0; // Check if there are events on this day
  /* console.log(day.date, hasEvents); */ // Debug: check if hasEvents is true when expected
  return (
    <button
      key={day.date}
      type="button"
      aria-label={`Day ${day.date}`}
      className={classNames(
        day.isCurrentMonth ? 'bg-white text-gray-900' : 'bg-gray-50 text-gray-400',
        dayIdx === 0 && 'rounded-tl-lg',
        dayIdx === 6 && 'rounded-tr-lg',
        dayIdx === month.days.length - 7 && 'rounded-bl-lg',
        dayIdx === month.days.length - 1 && 'rounded-br-lg',
        'py-1.5 hover:bg-gray-100 focus:z-10',
      )}
      onClick={() => handleDateClick(new Date(day.date))}
    >
      <time
        dateTime={day.date}
        className={classNames(
          day.isToday && 'bg-sky-600 font-semibold text-white',
          'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
          day.isSelected && 'bg-sky-600 font-semibold text-white',
          'mx-auto flex h-7 w-7 items-center justify-center rounded-full'
        )}
      >
        {day.date.split('-').pop()?.replace(/^0/, '') || ''}
      </time>
      {/* Render a dot if the day has events */}
      {hasEvents && (
        <div className="flex justify-center">
          <span className="block w-1.5 h-1.5 mt-1 rounded-full bg-orange-500"></span>
        </div>
      )}
    </button>
  );
})}
              </div>
            </section>
          ))}
        </div>
        {selectedDay && selectedDay.events.length > 0 && (
        <div className="px-4 py-10 sm:px-6">
          <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
            {selectedDay.events.map((event) => (
              <li key={event.id} className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
                <div className="flex-auto">
                  <p className="font-semibold text-gray-900">{event.name}</p>
                  
                  <time dateTime={event.datetime} className="mt-2 flex justify-between items-center text-gray-700">
                   {format(parseISO(event.datetime), 'dd-MM-yyyy')} {'   '}
                   
                    {event.begintijd} - {event.eindtijd}
                  </time>
                </div>
                <LeButton link={`/dashboard/shift/bedrijf/${event.id}`} buttonText="Bekijk" />
              </li>
            ))}
          </ol>
        </div>
      )}
      </div>
    </div>
  );
}


