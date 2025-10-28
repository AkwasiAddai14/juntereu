'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/[lang]/components/ui/button';
import { Input } from '@/app/[lang]/components/ui/input';
import { Label } from '@/app/[lang]/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/[lang]/components/ui/card';
import { Badge } from '@/app/[lang]/components/ui/badge';

interface DayBudget {
  date: string;
  amount: number;
  percentage: number;
  isSet: boolean;
}

interface WeekBudget {
  weekStart: string;
  weekEnd: string;
  totalAmount: number;
  days: DayBudget[];
  remainingPercentage: number;
}

interface BudgetCalendarProps {
  budgetType: 'weekly' | 'monthly';
  totalBudget: number;
  currency: string;
  onDayBudgetChange: (date: string, amount: number, percentage: number) => void;
  onWeekBudgetChange: (weekStart: string, weekEnd: string, totalAmount: number) => void;
  onDistributeRemaining: (weekStart: string, weekEnd: string) => void;
  existingBudgets?: { [date: string]: { amount: number; percentage: number; isSet?: boolean } };
}

const BudgetCalendar: React.FC<BudgetCalendarProps> = ({
  budgetType,
  totalBudget,
  currency,
  onDayBudgetChange,
  onWeekBudgetChange,
  onDistributeRemaining,
  existingBudgets = {}
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState<WeekBudget | null>(null);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [weekBudgets, setWeekBudgets] = useState<{ [key: string]: WeekBudget }>({});

  // Generate weekly view data
  const generateWeeklyView = (year: number, month: number) => {
    const weeks: WeekBudget[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Find the first Monday of the month
    const firstMonday = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    firstMonday.setDate(firstDay.getDate() - daysToMonday);
    
    // Generate weeks
    let currentWeekStart = new Date(firstMonday);
    while (currentWeekStart <= lastDay) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);
      
      const weekKey = `${currentWeekStart.toISOString().split('T')[0]}-${weekEnd.toISOString().split('T')[0]}`;
      const existingWeek = weekBudgets[weekKey];
      
      const days: DayBudget[] = [];
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(currentWeekStart);
        dayDate.setDate(currentWeekStart.getDate() + i);
        const dateStr = dayDate.toISOString().split('T')[0];
        
        const existing = existingBudgets[dateStr] || existingWeek?.days.find(d => d.date === dateStr);
        days.push({
          date: dateStr,
          amount: existing?.amount || 0,
          percentage: existing?.percentage || 0,
          isSet: existing?.isSet || false
        });
      }
      
      const weekTotal = days.reduce((sum, day) => sum + day.amount, 0);
      const totalPercentage = days.reduce((sum, day) => sum + day.percentage, 0);
      
      weeks.push({
        weekStart: currentWeekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
        totalAmount: weekTotal,
        days,
        remainingPercentage: 100 - totalPercentage
      });
      
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    
    return weeks;
  };

  // Generate monthly view data
  const generateMonthlyView = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: DayBudget[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const existing = existingBudgets[dateStr];
      
      days.push({
        date: dateStr,
        amount: existing?.amount || 0,
        percentage: existing?.percentage || 0,
        isSet: existing?.isSet || false
      });
    }
    
    return days;
  };

  // Generate calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    if (viewMode === 'weekly') {
      return generateWeeklyView(year, month);
    } else {
      return generateMonthlyView(year, month);
    }
  }, [currentDate, viewMode]) as WeekBudget[] | DayBudget[];

  // Handle day budget change
  const handleDayBudgetChange = (date: string, amount: number, weekStart?: string) => {
    const percentage = totalBudget > 0 ? (amount / totalBudget) * 100 : 0;
    
    onDayBudgetChange(date, amount, percentage);
    
    if (weekStart && viewMode === 'weekly') {
      updateWeekBudget(weekStart, date, amount, percentage);
    }
  };

  // Update week budget totals
  const updateWeekBudget = (weekStart: string, date: string, amount: number, percentage: number) => {
    setWeekBudgets(prev => {
      const weekKey = `${weekStart}-${new Date(new Date(weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`;
      const existingWeek = prev[weekKey];
      
      if (existingWeek) {
        const updatedDays = existingWeek.days.map(day => 
          day.date === date 
            ? { ...day, amount, percentage, isSet: true }
            : day
        );
        
        const totalAmount = updatedDays.reduce((sum, day) => sum + day.amount, 0);
        const totalPercentage = updatedDays.reduce((sum, day) => sum + day.percentage, 0);
        
        return {
          ...prev,
          [weekKey]: {
            ...existingWeek,
            days: updatedDays,
            totalAmount,
            remainingPercentage: 100 - totalPercentage
          }
        };
      }
      
      return prev;
    });
  };

  // Distribute remaining budget evenly
  const distributeRemainingBudget = (week: WeekBudget) => {
    const remainingDays = week.days.filter(day => !day.isSet);
    if (remainingDays.length === 0) return;
    
    const remainingAmount = (week.remainingPercentage / 100) * totalBudget;
    const amountPerDay = remainingAmount / remainingDays.length;
    const percentagePerDay = week.remainingPercentage / remainingDays.length;
    
    remainingDays.forEach(day => {
      handleDayBudgetChange(day.date, amountPerDay, week.weekStart);
    });
  };

  // Navigate months
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('weekly')}
          >
            Weekly View
          </Button>
          <Button
            variant={viewMode === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('monthly')}
          >
            Monthly View
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      {viewMode === 'weekly' ? (
        <div className="space-y-4">
          {(calendarData as WeekBudget[]).map((week, weekIndex) => (
            <Card key={weekIndex} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Week {weekIndex + 1}: {formatDate(week.weekStart)} - {formatDate(week.weekEnd)}
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      Total: {formatCurrency(week.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Remaining: {week.remainingPercentage.toFixed(1)}%
                    </div>
                    {week.remainingPercentage > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => distributeRemainingBudget(week)}
                      >
                        Distribute Remaining
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {week.days.map((day, dayIndex) => (
                    <div key={dayIndex} className="space-y-2">
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-600">
                          {formatDate(day.date).split(' ')[0]}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(day.date).split(' ').slice(1).join(' ')}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor={`amount-${day.date}`} className="text-xs">
                          Amount
                        </Label>
                        <Input
                          id={`amount-${day.date}`}
                          type="number"
                          value={day.amount || ''}
                          onChange={(e) => handleDayBudgetChange(
                            day.date, 
                            parseFloat(e.target.value) || 0,
                            week.weekStart
                          )}
                          placeholder="0"
                          className="h-8 text-xs"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor={`percentage-${day.date}`} className="text-xs">
                          %
                        </Label>
                        <Input
                          id={`percentage-${day.date}`}
                          type="number"
                          value={day.percentage.toFixed(1)}
                          onChange={(e) => {
                            const percentage = parseFloat(e.target.value) || 0;
                            const amount = (percentage / 100) * totalBudget;
                            handleDayBudgetChange(day.date, amount, week.weekStart);
                          }}
                          placeholder="0"
                          className="h-8 text-xs"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>
                      
                      {day.isSet && (
                        <Badge variant="secondary" className="text-xs">
                          Set
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                  {day}
                </div>
              ))}
              {(calendarData as DayBudget[]).map((day, index) => {
                const date = new Date(day.date);
                const dayOfWeek = date.getDay();
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                
                return (
                  <div
                    key={index}
                    className={`p-2 border rounded ${
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    }`}
                    style={{ gridColumnStart: dayOfWeek === 0 ? 7 : dayOfWeek }}
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">{date.getDate()}</div>
                      <div className="space-y-1 mt-2">
                        <Input
                          type="number"
                          value={day.amount || ''}
                          onChange={(e) => handleDayBudgetChange(
                            day.date, 
                            parseFloat(e.target.value) || 0
                          )}
                          placeholder="0"
                          className="h-6 text-xs"
                        />
                        <div className="text-xs text-gray-500">
                          {day.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetCalendar;
