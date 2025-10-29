"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/app/[lang]/components/ui/button';
import { Input } from '@/app/[lang]/components/ui/input';
import { Label } from '@/app/[lang]/components/ui/label';
import { Textarea } from '@/app/[lang]/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/[lang]/components/ui/select';
import { createBudget, updateBudget, getActiveBudget, CreateBudgetInput, UpdateBudgetInput } from '@/app/lib/actions/budget.actions';
import { toast } from '@/app/[lang]/components/ui/use-toast';
import { CalendarIcon, CurrencyEuroIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface BudgetFormProps {
  employerId: string;
  onClose: () => void;
  onSuccess: () => void;
  existingBudget?: any;
}

export default function BudgetForm({ employerId, onClose, onSuccess, existingBudget }: BudgetFormProps) {
  const [loading, setLoading] = useState(false);
  const [budgetType, setBudgetType] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [isPercentage, setIsPercentage] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors }, control } = useForm({
    defaultValues: {
      name: existingBudget?.name || '',
      description: existingBudget?.description || '',
      total: existingBudget?.budgetAmount?.total || 0,
      currency: existingBudget?.budgetAmount?.currency || 'EUR',
      percentage: existingBudget?.budgetAmount?.percentage || 0,
      revenue: existingBudget?.budgetAmount?.revenue || 0,
      startDate: existingBudget?.period?.startDate ? new Date(existingBudget.period.startDate).toISOString().split('T')[0] : '',
      endDate: existingBudget?.period?.endDate ? new Date(existingBudget.period.endDate).toISOString().split('T')[0] : '',
    }
  });

  const watchedTotal = watch('total');
  const watchedPercentage = watch('percentage');
  const watchedRevenue = watch('revenue');

  useEffect(() => {
    if (existingBudget) {
      setBudgetType(existingBudget.type);
      setIsPercentage(existingBudget.budgetAmount?.isPercentage || false);
    }
  }, [existingBudget]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (startDate >= endDate) {
        toast({
          title: "Invalid Date Range",
          description: "End date must be after start date.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const budgetData = {
        employer: employerId,
        name: data.name,
        description: data.description,
        type: budgetType,
        period: {
          startDate,
          endDate
        },
        budgetAmount: {
          total: isPercentage ? (data.revenue * data.percentage / 100) : data.total,
          currency: data.currency,
          isPercentage,
          ...(isPercentage && { percentage: data.percentage, revenue: data.revenue })
        }
      };

      if (existingBudget) {
        await updateBudget(existingBudget._id, budgetData);
        toast({
          title: "Budget Updated",
          description: "Your budget has been updated successfully.",
          variant: "default"
        });
      } else {
        await createBudget(budgetData);
        toast({
          title: "Budget Created",
          description: "Your budget has been created successfully.",
          variant: "default"
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving budget:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save budget. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculatedAmount = isPercentage ? (watchedRevenue * watchedPercentage / 100) : watchedTotal;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ChartBarIcon className="w-6 h-6 text-blue-600" />
              {existingBudget ? 'Edit Budget' : 'Create Budget'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Budget Name *</Label>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Budget name is required' }}
                render={({ field }) => (
                  <Input
                    id="name"
                    {...field}
                    placeholder="e.g., Monthly Operations Budget"
                    className="mt-1 h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                )}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    {...field}
                    placeholder="Optional description of this budget"
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    rows={3}
                  />
                )}
              />
            </div>
          </div>

          {/* Budget Type and Period */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Budget Type & Period</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">Budget Type *</Label>
                <Select value={budgetType} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setBudgetType(value)}>
                  <SelectTrigger className="mt-1 h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select budget type" />
                  </SelectTrigger>
                  <SelectContent className="z-50 min-w-[200px] rounded-lg border border-gray-200 bg-white shadow-lg">
                    <SelectItem value="daily" className="cursor-pointer rounded-md px-3 py-2 text-gray-900 hover:bg-blue-50 focus:bg-blue-50 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Daily
                      </div>
                    </SelectItem>
                    <SelectItem value="weekly" className="cursor-pointer rounded-md px-3 py-2 text-gray-900 hover:bg-blue-50 focus:bg-blue-50 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Weekly
                      </div>
                    </SelectItem>
                    <SelectItem value="monthly" className="cursor-pointer rounded-md px-3 py-2 text-gray-900 hover:bg-blue-50 focus:bg-blue-50 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Monthly
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currency" className="text-sm font-medium text-gray-700">Currency</Label>
                <Select value={watch('currency')} onValueChange={(value) => setValue('currency', value)}>
                  <SelectTrigger className="mt-1 h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="z-50 min-w-[200px] rounded-lg border border-gray-200 bg-white shadow-lg">
                    <SelectItem value="EUR" className="cursor-pointer rounded-md px-3 py-2 text-gray-900 hover:bg-blue-50 focus:bg-blue-50 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">€</span>
                        <span>EUR (€)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="USD" className="cursor-pointer rounded-md px-3 py-2 text-gray-900 hover:bg-blue-50 focus:bg-blue-50 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">$</span>
                        <span>USD ($)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="GBP" className="cursor-pointer rounded-md px-3 py-2 text-gray-900 hover:bg-blue-50 focus:bg-blue-50 data-[state=checked]:bg-blue-100 data-[state=checked]:text-blue-900">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">£</span>
                        <span>GBP (£)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date *</Label>
                <div className="relative mt-1">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Controller
                    name="startDate"
                    control={control}
                    rules={{ required: 'Start date is required' }}
                    render={({ field }) => (
                      <Input
                        id="startDate"
                        type="date"
                        {...field}
                        className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    )}
                  />
                </div>
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
              </div>

              <div>
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date *</Label>
                <div className="relative mt-1">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Controller
                    name="endDate"
                    control={control}
                    rules={{ required: 'End date is required' }}
                    render={({ field }) => (
                      <Input
                        id="endDate"
                        type="date"
                        {...field}
                        className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    )}
                  />
                </div>
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
              </div>
            </div>
          </div>

          {/* Budget Amount */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Budget Amount</h3>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isPercentage"
                checked={isPercentage}
                onChange={(e) => setIsPercentage(e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md transition-colors"
              />
              <Label htmlFor="isPercentage" className="text-sm font-medium text-gray-700 cursor-pointer">Set as percentage of revenue</Label>
            </div>

            {isPercentage ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="revenue" className="text-sm font-medium text-gray-700">Revenue Amount *</Label>
                  <div className="relative mt-1">
                    <CurrencyEuroIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Controller
                      name="revenue"
                      control={control}
                      rules={{ 
                        required: isPercentage ? 'Revenue amount is required' : false,
                        min: { value: 0, message: 'Revenue must be positive' }
                      }}
                      render={({ field }) => (
                        <Input
                          id="revenue"
                          type="number"
                          step="0.01"
                          {...field}
                          placeholder="0.00"
                          className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      )}
                    />
                  </div>
                  {errors.revenue && <p className="text-red-500 text-sm mt-1">{errors.revenue.message}</p>}
                </div>

                <div>
                  <Label htmlFor="percentage" className="text-sm font-medium text-gray-700">Percentage *</Label>
                  <div className="relative mt-1">
                    <Controller
                      name="percentage"
                      control={control}
                      rules={{ 
                        required: isPercentage ? 'Percentage is required' : false,
                        min: { value: 0, message: 'Percentage must be between 0-100' },
                        max: { value: 100, message: 'Percentage must be between 0-100' }
                      }}
                      render={({ field }) => (
                        <Input
                          id="percentage"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          {...field}
                          placeholder="0"
                          className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 pr-8 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      )}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
                  </div>
                  {errors.percentage && <p className="text-red-500 text-sm mt-1">{errors.percentage.message}</p>}
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="total" className="text-sm font-medium text-gray-700">Budget Amount *</Label>
                <div className="relative mt-1">
                  <CurrencyEuroIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Controller
                    name="total"
                    control={control}
                    rules={{ 
                      required: !isPercentage ? 'Budget amount is required' : false,
                      min: { value: 0, message: 'Budget amount must be positive' }
                    }}
                    render={({ field }) => (
                      <Input
                        id="total"
                        type="number"
                        step="0.01"
                        {...field}
                        placeholder="0.00"
                        className="h-12 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    )}
                  />
                </div>
                {errors.total && <p className="text-red-500 text-sm mt-1">{errors.total.message}</p>}
              </div>
            )}

            {isPercentage && calculatedAmount > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Calculated Budget Amount:</strong> {watch('currency')} {calculatedAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="h-12 px-6 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-12 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {existingBudget ? 'Update Budget' : 'Create Budget'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}