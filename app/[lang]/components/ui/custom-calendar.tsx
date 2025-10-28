'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/[lang]/components/ui/button';
import { cn } from '@/app/lib/utils';

interface CustomCalendarProps {
  mode: "range";
  selectedRange?: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  className?: string;
}

export default function CustomCalendar({
  mode,
  selectedRange,
  onDateRangeChange,
  className
}: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Create array of days for the month
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }
  
  const monthNames = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december'
  ];
  
  const dayNames = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const handleDateClick = (date: Date) => {
    if (!onDateRangeChange) return;
    
    if (!selectedRange?.from || (selectedRange.from && selectedRange.to)) {
      // Start new range
      onDateRangeChange({ from: date, to: undefined });
    } else if (selectedRange.from && !selectedRange.to) {
      // Complete the range
      if (date < selectedRange.from) {
        onDateRangeChange({ from: date, to: selectedRange.from });
      } else {
        onDateRangeChange({ from: selectedRange.from, to: date });
      }
    }
  };
  
  const isDateInRange = (date: Date) => {
    if (!selectedRange?.from) return false;
    if (selectedRange.to) {
      return date >= selectedRange.from && date <= selectedRange.to;
    }
    return date.getTime() === selectedRange.from.getTime();
  };
  
  const isDateSelected = (date: Date) => {
    if (!selectedRange?.from) return false;
    if (selectedRange.to) {
      return date.getTime() === selectedRange.from.getTime() || 
             date.getTime() === selectedRange.to.getTime();
    }
    return date.getTime() === selectedRange.from.getTime();
  };
  
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };
  
  return (
    <div className={cn("w-full bg-white border rounded-lg p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('prev')}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-semibold">
          {monthNames[month]} {year}
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateMonth('next')}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="aspect-square">
            {date ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDateClick(date)}
                className={cn(
                  "w-full h-full p-0 text-sm font-normal",
                  isDateSelected(date) && "bg-blue-600 text-white hover:bg-blue-700",
                  isDateInRange(date) && !isDateSelected(date) && "bg-blue-100 text-blue-900",
                  isToday(date) && !isDateSelected(date) && "bg-gray-100 text-gray-900 font-semibold",
                  !isDateSelected(date) && !isDateInRange(date) && !isToday(date) && "hover:bg-gray-100"
                )}
              >
                {date.getDate()}
              </Button>
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
