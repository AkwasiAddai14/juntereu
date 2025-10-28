"use client";

import React from 'react';
import { IBudget } from '@/app/lib/models/budget.model';
import { BudgetAnalytics as BudgetAnalyticsType } from '@/app/lib/hooks/useBudgetManager';
import {
  ChartBarIcon,
  CurrencyEuroIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface BudgetAnalyticsProps {
  budget: IBudget;
  analytics: BudgetAnalyticsType;
  components: any;
}

const BudgetAnalytics: React.FC<BudgetAnalyticsProps> = ({ budget, analytics, components }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-orange-600 bg-orange-100';
      case 'exceeded': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircleIcon className="w-5 h-5" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'critical': return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'exceeded': return <XCircleIcon className="w-5 h-5" />;
      default: return <ChartBarIcon className="w-5 h-5" />;
    }
  };

  const getTrendIcon = (current: number, projected: number) => {
    if (projected > current) {
      return <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />;
    } else {
      return <ArrowTrendingDownIcon className="w-4 h-4 text-green-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `${budget.budgetAmount.currency} ${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{budget.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{budget.type} Budget</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(analytics.budgetStatus)}`}>
            {getStatusIcon(analytics.budgetStatus)}
            {analytics.budgetStatus.charAt(0).toUpperCase() + analytics.budgetStatus.slice(1)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(budget.budgetAmount.total)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Spent</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(budget.spending.total)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(analytics.remainingBudget)}</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Budget Utilization</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-gray-900">{formatPercentage(analytics.utilizationPercentage)}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                analytics.utilizationPercentage >= 100 ? 'bg-red-500' :
                analytics.utilizationPercentage >= 90 ? 'bg-orange-500' :
                analytics.utilizationPercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(analytics.utilizationPercentage, 100)}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CurrencyEuroIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Daily Average</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.averageDailySpending)}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Projected Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.projectedSpending)}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Days Remaining</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.daysRemaining}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            {getTrendIcon(budget.spending.total, analytics.projectedSpending)}
            <span className="text-sm font-medium text-gray-700">Trend</span>
          </div>
          <p className="text-sm text-gray-600">
            {analytics.projectedSpending > budget.spending.total ? 'Over Budget' : 'On Track'}
          </p>
        </div>
      </div>

      {/* Spending Breakdown by Period */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Spending Breakdown</h4>
        
        <div className="space-y-4">
          {/* Daily Spending */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Daily Spending</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {Object.entries(budget.spending.daily).slice(-7).map(([date, amount]) => (
                <div key={date} className="text-center">
                  <p className="text-xs text-gray-600">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(amount)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Spending */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Weekly Spending</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(budget.spending.weekly).slice(-4).map(([week, amount]) => (
                <div key={week} className="text-center">
                  <p className="text-xs text-gray-600">Week {week}</p>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(amount)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Spending */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Monthly Spending</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(budget.spending.monthly).slice(-3).map(([month, amount]) => (
                <div key={month} className="text-center">
                  <p className="text-xs text-gray-600">{month}</p>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h4>
        
        <div className="space-y-3">
          {analytics.budgetStatus === 'exceeded' && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <XCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Budget Exceeded</p>
                <p className="text-sm text-red-700">Your budget has been exceeded. Consider reviewing your spending or adjusting your budget.</p>
              </div>
            </div>
          )}

          {analytics.budgetStatus === 'critical' && (
            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-800">Critical Budget Level</p>
                <p className="text-sm text-orange-700">You're at 90%+ of your budget. Consider reducing spending or pausing new hires.</p>
              </div>
            </div>
          )}

          {analytics.budgetStatus === 'warning' && (
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Budget Warning</p>
                <p className="text-sm text-yellow-700">You're at 75%+ of your budget. Monitor your spending closely.</p>
              </div>
            </div>
          )}

          {analytics.budgetStatus === 'healthy' && (
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Budget Healthy</p>
                <p className="text-sm text-green-700">Your budget is in good shape. Continue monitoring your spending.</p>
              </div>
            </div>
          )}

          {analytics.projectedSpending > budget.budgetAmount.total && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Projected Overrun</p>
                <p className="text-sm text-blue-700">At current spending rate, you'll exceed your budget by {formatCurrency(analytics.projectedSpending - budget.budgetAmount.total)}.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetAnalytics;
