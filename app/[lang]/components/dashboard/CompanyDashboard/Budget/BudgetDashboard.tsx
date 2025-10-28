"use client";

import React, { useState } from 'react';
import { useBudgetManager, BudgetAnalytics } from '@/app/lib/hooks/useBudgetManager';
import { IBudget } from '@/app/lib/models/budget.model';
import { 
  PlusIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  CurrencyEuroIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface BudgetDashboardProps {
  employerId: string;
  components: any;
}

const BudgetDashboard: React.FC<BudgetDashboardProps> = ({ employerId, components }) => {
  const {
    budgets,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    calculateSpending,
    getAnalytics,
    refreshBudgets
  } = useBudgetManager(employerId);

  const [selectedBudget, setSelectedBudget] = useState<IBudget | null>(null);
  const [analytics, setAnalytics] = useState<BudgetAnalytics | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleBudgetSelect = async (budget: IBudget) => {
    setSelectedBudget(budget);
    const analyticsData = await getAnalytics(budget._id as string);
    if (analyticsData) {
      setAnalytics(analyticsData.analytics);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {components?.budget?.title || 'Budget Management'}
          </h2>
          <p className="text-gray-600 mt-1">
            {components?.budget?.subtitle || 'Track and manage your hiring budgets'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          {components?.budget?.createButton || 'Create Budget'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircleIcon className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => (
          <div
            key={budget._id as string}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleBudgetSelect(budget)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{budget.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{budget.type} Budget</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analytics?.budgetStatus || 'healthy')}`}>
                {analytics?.budgetStatus || 'Active'}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Budget</span>
                <span className="font-semibold text-gray-900">
                  {budget.budgetAmount.currency} {budget.budgetAmount.total.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Spent</span>
                <span className="font-semibold text-gray-900">
                  {budget.budgetAmount.currency} {budget.spending.total.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Remaining</span>
                <span className="font-semibold text-gray-900">
                  {budget.budgetAmount.currency} {(budget.budgetAmount.total - budget.spending.total).toLocaleString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    analytics?.utilizationPercentage >= 100 ? 'bg-red-500' :
                    analytics?.utilizationPercentage >= 90 ? 'bg-orange-500' :
                    analytics?.utilizationPercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(analytics?.utilizationPercentage || 0, 100)}%` }}
                ></div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                {analytics?.utilizationPercentage.toFixed(1) || 0}% utilized
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Period</span>
                <span>
                  {new Date(budget.period.startDate).toLocaleDateString()} - {new Date(budget.period.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {budgets.length === 0 && (
        <div className="text-center py-12">
          <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {components?.budget?.emptyState?.title || 'No budgets created yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {components?.budget?.emptyState?.description || 'Create your first budget to start tracking your hiring costs'}
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            {components?.budget?.createButton || 'Create Budget'}
          </button>
        </div>
      )}

      {/* Budget Details Modal */}
      {selectedBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{selectedBudget.name}</h3>
                <button
                  onClick={() => setSelectedBudget(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(analytics.budgetStatus)}
                      <span className="text-sm font-medium text-gray-600">Status</span>
                    </div>
                    <p className={`text-lg font-semibold ${getStatusColor(analytics.budgetStatus).split(' ')[0]}`}>
                      {analytics.budgetStatus.charAt(0).toUpperCase() + analytics.budgetStatus.slice(1)}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CurrencyEuroIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Remaining</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedBudget.budgetAmount.currency} {analytics.remainingBudget.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ChartBarIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Utilization</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {analytics.utilizationPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}

              {/* Detailed Analytics */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Spending Breakdown</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Daily Average</h5>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedBudget.budgetAmount.currency} {analytics?.averageDailySpending.toFixed(2) || 0}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Projected Total</h5>
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedBudget.budgetAmount.currency} {analytics?.projectedSpending.toFixed(2) || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Days Remaining</h5>
                  <p className="text-2xl font-bold text-green-600">
                    {analytics?.daysRemaining || 0} days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetDashboard;
