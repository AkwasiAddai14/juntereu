'use client'

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, CurrencyDollarIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';

import { Button } from '@/app/[lang]/components/ui/button';
import { Input } from '@/app/[lang]/components/ui/input';
import { Label } from '@/app/[lang]/components/ui/label';
import { Textarea } from '@/app/[lang]/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/[lang]/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/[lang]/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/[lang]/components/ui/select';
import { Badge } from '@/app/[lang]/components/ui/badge';
import { Progress } from '@/app/[lang]/components/ui/progress';
import BudgetCalendar from './BudgetCalendar';

const budgetSchema = z.object({
  name: z.string().min(1, 'Budget name is required'),
  description: z.string().optional(),
  budgetType: z.enum(['daily', 'weekly', 'monthly']),
  currency: z.string().min(1, 'Currency is required'),
  totalAmount: z.number().min(0, 'Amount must be positive'),
  isPercentage: z.boolean(),
  percentage: z.number().min(0).max(100).optional(),
  revenue: z.number().min(0).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface DayBudget {
  date: string;
  amount: number;
  percentage: number;
  isSet: boolean;
}

interface EnhancedBudgetFormProps {
  employerId: string;
  onClose: () => void;
  onSuccess: (budget: any) => void;
  existingBudget?: any;
}

const EnhancedBudgetForm: React.FC<EnhancedBudgetFormProps> = ({
  employerId,
  onClose,
  onSuccess,
  existingBudget
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dayBudgets, setDayBudgets] = useState<{ [date: string]: DayBudget }>({});
  const [weeklyBudgets, setWeeklyBudgets] = useState<{ [week: string]: number }>({});
  const [monthlyBudgets, setMonthlyBudgets] = useState<{ [month: string]: number }>({});
  const [budgetType, setBudgetType] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [totalBudget, setTotalBudget] = useState(0);
  const [currency, setCurrency] = useState('EUR');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      name: existingBudget?.name || '',
      description: existingBudget?.description || '',
      budgetType: existingBudget?.budgetType || 'monthly',
      currency: existingBudget?.budgetAmount?.currency || 'EUR',
      totalAmount: existingBudget?.budgetAmount?.total || 0,
      isPercentage: existingBudget?.budgetAmount?.isPercentage || false,
      percentage: existingBudget?.budgetAmount?.percentage || 0,
      revenue: existingBudget?.budgetAmount?.revenue || 0,
      startDate: existingBudget?.period?.startDate || new Date().toISOString().split('T')[0],
      endDate: existingBudget?.period?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  const watchedValues = watch();
  const isPercentage = watch('isPercentage');
  const totalAmount = watch('totalAmount');
  const selectedBudgetType = watch('budgetType');

  // Update budget type and total when form values change
  useEffect(() => {
    setBudgetType(selectedBudgetType);
    setTotalBudget(totalAmount);
    setCurrency(watchedValues.currency);
  }, [selectedBudgetType, totalAmount, watchedValues.currency]);

  // Handle day budget changes from calendar
  const handleDayBudgetChange = (date: string, amount: number, percentage: number) => {
    setDayBudgets(prev => ({
      ...prev,
      [date]: {
        date,
        amount,
        percentage,
        isSet: true
      }
    }));
  };

  // Handle week budget changes
  const handleWeekBudgetChange = (weekStart: string, weekEnd: string, totalAmount: number) => {
    const weekKey = `${weekStart}-${weekEnd}`;
    setWeeklyBudgets(prev => ({
      ...prev,
      [weekKey]: totalAmount
    }));
  };

  // Distribute remaining budget
  const handleDistributeRemaining = (weekStart: string, weekEnd: string) => {
    // This will be handled by the calendar component
    console.log('Distributing remaining budget for week:', weekStart, weekEnd);
  };

  // Calculate budget distribution summary
  const calculateBudgetSummary = () => {
    const totalDays = Object.keys(dayBudgets).length;
    const totalAllocated = Object.values(dayBudgets).reduce((sum, day) => sum + day.amount, 0);
    const totalPercentage = Object.values(dayBudgets).reduce((sum, day) => sum + day.percentage, 0);
    const remainingAmount = totalBudget - totalAllocated;
    const remainingPercentage = 100 - totalPercentage;

    return {
      totalDays,
      totalAllocated,
      totalPercentage,
      remainingAmount,
      remainingPercentage
    };
  };

  const budgetSummary = calculateBudgetSummary();

  // Handle form submission
  const onSubmit = async (data: BudgetFormData) => {
    setIsLoading(true);
    try {
      // Prepare budget data with calendar allocations
      const budgetData = {
        ...data,
        employer: employerId,
        dayBudgets: Object.values(dayBudgets),
        weeklyBudgets,
        monthlyBudgets,
        status: 'active'
      };

      // Here you would call your API to save the budget
      console.log('Submitting budget:', budgetData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess(budgetData);
    } catch (error) {
      console.error('Error creating budget:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {existingBudget ? 'Edit Budget' : 'Create New Budget'}
        </h2>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5" />
                Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Budget Name *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="e.g., Q1 Marketing Budget"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Describe your budget..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="budgetType" className="text-sm font-medium text-gray-700 mb-2 block">Budget Type *</Label>
                    <Select
                      value={selectedBudgetType}
                      onValueChange={(value) => setValue('budgetType', value as any)}
                    >
                      <SelectTrigger className="h-12 bg-blue-50 border-2 border-blue-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                        <SelectValue placeholder="Select budget type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-200 shadow-lg rounded-lg">
                        <SelectItem 
                          value="daily" 
                          className="hover:bg-blue-50 focus:bg-blue-50 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900 font-medium"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Daily Budget
                          </div>
                        </SelectItem>
                        <SelectItem 
                          value="weekly" 
                          className="hover:bg-blue-50 focus:bg-blue-50 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900 font-medium"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            Weekly Budget
                          </div>
                        </SelectItem>
                        <SelectItem 
                          value="monthly" 
                          className="hover:bg-blue-50 focus:bg-blue-50 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900 font-medium"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Monthly Budget
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.budgetType && (
                      <p className="text-sm text-red-600 mt-1">{errors.budgetType.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currency">Currency *</Label>
                    <Select
                      value={currency}
                      onValueChange={(value) => {
                        setCurrency(value);
                        setValue('currency', value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.currency && (
                      <p className="text-sm text-red-600">{errors.currency.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="totalAmount">Total Budget Amount *</Label>
                    <div className="relative">
                      <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="totalAmount"
                        type="number"
                        {...register('totalAmount', { valueAsNumber: true })}
                        placeholder="0"
                        className="pl-10"
                      />
                    </div>
                    {errors.totalAmount && (
                      <p className="text-sm text-red-600">{errors.totalAmount.message}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPercentage"
                      {...register('isPercentage')}
                      className="rounded"
                    />
                    <Label htmlFor="isPercentage">Based on percentage of revenue</Label>
                  </div>

                  {isPercentage && (
                    <div>
                      <Label htmlFor="percentage">Percentage of Revenue (%)</Label>
                      <Input
                        id="percentage"
                        type="number"
                        {...register('percentage', { valueAsNumber: true })}
                        placeholder="0"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                  )}

                  {isPercentage && (
                    <div>
                      <Label htmlFor="revenue">Revenue Amount</Label>
                      <Input
                        id="revenue"
                        type="number"
                        {...register('revenue', { valueAsNumber: true })}
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="startDate"
                      type="date"
                      {...register('startDate')}
                      className="pl-10"
                    />
                  </div>
                  {errors.startDate && (
                    <p className="text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="endDate"
                      type="date"
                      {...register('endDate')}
                      className="pl-10"
                    />
                  </div>
                  {errors.endDate && (
                    <p className="text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Budget Calendar
              </CardTitle>
              <p className="text-sm text-gray-600">
                Set daily budgets based on your {selectedBudgetType} budget of {currency} {totalAmount.toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <BudgetCalendar
                budgetType={selectedBudgetType}
                totalBudget={totalAmount}
                currency={currency}
                onDayBudgetChange={handleDayBudgetChange}
                onWeekBudgetChange={handleWeekBudgetChange}
                onDistributeRemaining={handleDistributeRemaining}
                existingBudgets={dayBudgets}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5" />
                Budget Distribution Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {budgetSummary.totalDays}
                  </div>
                  <div className="text-sm text-gray-600">Days Allocated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currency} {budgetSummary.totalAllocated.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Allocated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {budgetSummary.totalPercentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Percentage Used</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Budget Utilization</span>
                    <span>{budgetSummary.totalPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={budgetSummary.totalPercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-800">Remaining Amount</div>
                    <div className="text-lg font-bold text-green-600">
                      {currency} {budgetSummary.remainingAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">Remaining Percentage</div>
                    <div className="text-lg font-bold text-blue-600">
                      {budgetSummary.remainingPercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {budgetSummary.remainingAmount > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-yellow-600" />
                    <div className="text-sm font-medium text-yellow-800">
                      You have {currency} {budgetSummary.remainingAmount.toLocaleString()} remaining to allocate
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Review Tab */}
        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Budget Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{watchedValues.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium capitalize">{watchedValues.budgetType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <span className="ml-2 font-medium">{currency} {watchedValues.totalAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Period:</span>
                    <span className="ml-2 font-medium">
                      {new Date(watchedValues.startDate).toLocaleDateString()} - {new Date(watchedValues.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Allocation Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Days Allocated:</span>
                    <span className="ml-2 font-medium">{budgetSummary.totalDays}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Allocated:</span>
                    <span className="ml-2 font-medium">{currency} {budgetSummary.totalAllocated.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Utilization:</span>
                    <span className="ml-2 font-medium">{budgetSummary.totalPercentage.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Remaining:</span>
                    <span className="ml-2 font-medium">{currency} {budgetSummary.remainingAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Creating...' : existingBudget ? 'Update Budget' : 'Create Budget'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedBudgetForm;
