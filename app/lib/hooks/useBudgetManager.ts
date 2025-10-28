"use client";

import { useState, useEffect } from 'react';
import { 
  createBudget, 
  getBudgetsByEmployer, 
  getBudgetsByType, 
  getBudgetById, 
  updateBudget, 
  deleteBudget, 
  calculateBudgetSpending, 
  getBudgetAnalytics,
  CreateBudgetInput,
  UpdateBudgetInput
} from '@/app/lib/actions/budget.actions';
import { IBudget } from '@/app/lib/models/budget.model';

export interface BudgetAnalytics {
  utilizationPercentage: number;
  remainingBudget: number;
  budgetStatus: 'healthy' | 'warning' | 'critical' | 'exceeded';
  averageDailySpending: number;
  projectedSpending: number;
  daysRemaining: number;
}

export interface UseBudgetManagerReturn {
  budgets: IBudget[];
  loading: boolean;
  error: string | null;
  createBudget: (input: CreateBudgetInput) => Promise<IBudget | null>;
  updateBudget: (budgetId: string, input: UpdateBudgetInput) => Promise<IBudget | null>;
  deleteBudget: (budgetId: string) => Promise<boolean>;
  calculateSpending: (budgetId: string) => Promise<IBudget | null>;
  getAnalytics: (budgetId: string) => Promise<{ budget: IBudget; analytics: BudgetAnalytics } | null>;
  refreshBudgets: () => Promise<void>;
  getBudgetsByType: (type: 'daily' | 'weekly' | 'monthly') => Promise<IBudget[]>;
}

export const useBudgetManager = (employerId: string): UseBudgetManagerReturn => {
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch budgets on mount
  useEffect(() => {
    if (employerId) {
      refreshBudgets();
    }
  }, [employerId]);

  const refreshBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBudgets = await getBudgetsByEmployer(employerId);
      setBudgets(fetchedBudgets);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch budgets');
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (input: CreateBudgetInput): Promise<IBudget | null> => {
    try {
      setError(null);
      const newBudget = await createBudget(input);
      if (newBudget) {
        setBudgets(prev => [newBudget, ...prev]);
      }
      return newBudget;
    } catch (err: any) {
      setError(err.message || 'Failed to create budget');
      console.error('Error creating budget:', err);
      return null;
    }
  };

  const handleUpdateBudget = async (budgetId: string, input: UpdateBudgetInput): Promise<IBudget | null> => {
    try {
      setError(null);
      const updatedBudget = await updateBudget(budgetId, input);
      if (updatedBudget) {
        setBudgets(prev => 
          prev.map(budget => 
            budget._id === budgetId ? updatedBudget : budget
          )
        );
      }
      return updatedBudget;
    } catch (err: any) {
      setError(err.message || 'Failed to update budget');
      console.error('Error updating budget:', err);
      return null;
    }
  };

  const handleDeleteBudget = async (budgetId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await deleteBudget(budgetId);
      if (success) {
        setBudgets(prev => prev.filter(budget => budget._id !== budgetId));
      }
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to delete budget');
      console.error('Error deleting budget:', err);
      return false;
    }
  };

  const handleCalculateSpending = async (budgetId: string): Promise<IBudget | null> => {
    try {
      setError(null);
      const updatedBudget = await calculateBudgetSpending(budgetId);
      if (updatedBudget) {
        setBudgets(prev => 
          prev.map(budget => 
            budget._id === budgetId ? updatedBudget : budget
          )
        );
      }
      return updatedBudget;
    } catch (err: any) {
      setError(err.message || 'Failed to calculate spending');
      console.error('Error calculating spending:', err);
      return null;
    }
  };

  const handleGetAnalytics = async (budgetId: string) => {
    try {
      setError(null);
      return await getBudgetAnalytics(budgetId);
    } catch (err: any) {
      setError(err.message || 'Failed to get analytics');
      console.error('Error getting analytics:', err);
      return null;
    }
  };

  const handleGetBudgetsByType = async (type: 'daily' | 'weekly' | 'monthly'): Promise<IBudget[]> => {
    try {
      setError(null);
      return await getBudgetsByType(employerId, type);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch budgets by type');
      console.error('Error fetching budgets by type:', err);
      return [];
    }
  };

  return {
    budgets,
    loading,
    error,
    createBudget: handleCreateBudget,
    updateBudget: handleUpdateBudget,
    deleteBudget: handleDeleteBudget,
    calculateSpending: handleCalculateSpending,
    getAnalytics: handleGetAnalytics,
    refreshBudgets,
    getBudgetsByType: handleGetBudgetsByType
  };
};
