'use client';

import { useState } from 'react';
import CustomCalendar from "@/app/[lang]/components/ui/custom-calendar";
import { Button } from '@/app/[lang]/components/ui/button';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

const MAX = 100;
const MIN = 0;

const euromarks = [
  { value: MIN, label: '' },
  { value: MAX, label: '' },
];

const distancemarks = [
  { value: MIN, label: '' },
  { value: MAX, label: '' },
];

interface SharedFiltersProps {
  dashboard: any;
  onFiltersChange?: (filters: {
    dateRange: { from: Date | undefined; to: Date | undefined };
    euroVal: number;
    distanceVal: number;
  }) => void;
}

export default function SharedFilters({ dashboard, onFiltersChange }: SharedFiltersProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [euroVal, setEuroVal] = useState(MIN);
  const [distanceVal, setDistanceVal] = useState(MIN);

  const handleUurtariefChange = (event: Event, newValue: number | number[]) => {
    setEuroVal(newValue as number);
  };

  const handleAfstandChange = (event: Event, newValue: number | number[]) => {
    setDistanceVal(newValue as number);
  };

  const handleApplyFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({
        dateRange,
        euroVal,
        distanceVal,
      });
    }
  };

  const handleResetFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setEuroVal(MIN);
    setDistanceVal(MIN);
    if (onFiltersChange) {
      onFiltersChange({
        dateRange: { from: undefined, to: undefined },
        euroVal: MIN,
        distanceVal: MIN,
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg mb-6">
      {/* <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3> */}
      
      <div className="space-y-6">
        {/* Calendar Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Date Range</h4>
          <CustomCalendar
            mode="range"
            selectedRange={dateRange}
            onDateRangeChange={(range: { from: Date | undefined; to: Date | undefined }) => setDateRange(range)}
          />
        </div>
        
        {/* Euro Filter */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">{dashboard?.werknemersPage?.Explore?.filter?.[1] || 'Hourly Rate'}</p>
          <Box sx={{ width: '100%' }}>
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
        
        {/* Distance Filter */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">{dashboard?.werknemersPage?.Explore?.filter?.[2] || 'Distance'}</p>
          <Box sx={{ width: '100%' }}>
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
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Button 
          className="bg-white text-black border-2 border-black hover:bg-gray-50" 
          onClick={handleApplyFilters}
        >
          {dashboard?.werknemersPage?.Explore?.buttons?.[1] || 'Apply Filters'}
        </Button>
        <Button 
          className="bg-sky-500 hover:bg-sky-600" 
          onClick={handleResetFilters}
        >
          {dashboard?.werknemersPage?.Explore?.buttons?.[0] || 'Reset Filters'}
        </Button>
      </div>
    </div>
  );
}
