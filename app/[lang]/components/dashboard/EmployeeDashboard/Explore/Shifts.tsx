'use client'

import * as React from "react";
import mongoose from "mongoose";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/app/[lang]/components/ui/scroll-area";
import ShiftCard from '@/app/[lang]/components/shared/cards/Wrappers/ShiftArrayWrapper';
import { haalShift } from "@/app/lib/actions/shiftArray.actions"
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { Button } from '@/app/[lang]/components/ui/button'
import { Calendar } from "@/app/[lang]/components/ui/calender"
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


const MAX = 100;
const MIN = 0;
const euromarks = [
  {
    value: MIN,
    label: '',
  },
  {
    value: MAX,
    label: '',
  },
];

const distancemarks = [
  {
    value: MIN,
    label: '',
  },
  {
    value: MAX,
    label: '',
  },
];

interface Props {
  lang: Locale;
  dashboard: any;
}

export default function Shifts ({ lang, dashboard }: Props){
  const { isLoaded, user } = useUser();
  const [freelancerId, setFreelancerId] = useState<any>(null);
  const [shift, setShift] = useState<any[]>([]);
  const [position, setPosition] = React.useState("Shifts");
  const [tarief, setTarief] = useState<number>(14);
  const [afstand, setAfstand] = useState<number>(5);
  const [euroVal, setEuroVal] = React.useState<number>(MIN);
  const handleUurtariefChange = (_: Event, newValue: number | number[]) => {
    setEuroVal(newValue as number);
    setTarief(euroVal);
  };
  const [distanceVal, setDistanceVal] = React.useState<number>(MIN);
  const handleAfstandChange = (_: Event, newValue: number | number[]) => {
    setDistanceVal(newValue as number);
    setAfstand(distanceVal);
  };
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    if (isLoaded && user) {
      setFreelancerId(user?.id)
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await haalShift(freelancerId as unknown as mongoose.Types.ObjectId);

        if (response) {
          // Sort the shifts by date
          
          const sortedShifts = response.sort((a: any, b: any) => {
            return new Date(a.begindatum).getTime() - new Date(b.begindatum).getTime(); // Ascending order
          });
          console.log(sortedShifts)
          setShift(sortedShifts); // Set the sorted shifts
        } else {
          setShift([]); // Handle case where response is empty or null
        }
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };
    fetchShifts();
  }, [freelancerId]);

    return (
      <>
                    <h1 className='mb-10 items-center justify-center text-4xl'>{dashboard.werknemersPage.Explore.ShiftPagina.headTitle}</h1>
            <ScrollArea>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {shift.slice(0, shift.length).map((shiftItem, index) => (
                        <ShiftCard key={index} shift={shiftItem} lang={lang}/>
                      ))}
                    </div>
            ) : ( 
              <div>{dashboard.werknemersPage.Explore.ShiftPagina.NoShifts}</div>
                )
                : null
            </ScrollArea>
            <aside className="fixed bottom-0 left-20 top-16 hidden w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
    {/* Secondary column (hidden on smaller screens) */}
    <div>
      <div>
        <Calendar
          mode="range"
          selectedRange={dateRange}
          onDateRangeChange={(range: React.SetStateAction<{ from: Date | undefined; to: Date | undefined }>) => setDateRange(range)}
        />
      </div>
      <div>
        <p className="mt-20">{dashboard.werknemersPage.Explore.filter[1]}</p>
        <Box sx={{ width: 250 }}>
          <Slider
            marks={euromarks}
            step={10}
            value={euroVal}
            valueLabelDisplay="auto"
            min={MIN}
            max={MAX}
            onChange={handleUurtariefChange}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant="body2"
              onClick={() => setEuroVal(MIN)}
              sx={{ cursor: 'pointer' }}
            >
              €{MIN} min
            </Typography>
            <Typography
              variant="body2"
              onClick={() => setEuroVal(MAX)}
              sx={{ cursor: 'pointer' }}
            >
              €{MAX}
            </Typography>
          </Box>
        </Box>
      </div>
      <p className="mt-20">{dashboard.werknemersPage.Explore.filter[0]}</p>
      <Box sx={{ width: 250 }}>
        <Slider
          marks={distancemarks}
          step={10}
          value={distanceVal}
          valueLabelDisplay="auto"
          min={MIN}
          max={MAX}
          onChange={handleAfstandChange}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="body2"
            onClick={() => setDistanceVal(MIN)}
            sx={{ cursor: 'pointer' }}
          >
            {MIN} km
          </Typography>
          <Typography
            variant="body2"
            onClick={() => setDistanceVal(MAX)}
            sx={{ cursor: 'pointer' }}
          >
            {MAX} km
          </Typography>
        </Box>
      </Box>
      <div className="justify-between">
        <Button className="mt-20 bg-white text-black border-2 border-black mr-10" onClick={() => setPosition("Shifts")}>
          {dashboard.werknemersPage.Explore.buttons[1]}
        </Button>
        <Button className="mt-20 bg-sky-500" onClick={() => setPosition('Filter')}>
        {dashboard.werknemersPage.Explore.buttons[0]}
        </Button>
      </div>
    </div>
  </aside>
            </>
    )
}