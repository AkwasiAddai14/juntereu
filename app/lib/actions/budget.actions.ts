"use server";

import { connectToDB } from '../mongoose';
import Budget, { IBudget } from '@/app/lib/models/budget.model';
import mongoose from 'mongoose';

export interface CreateBudgetInput {
  employer: string;
  name: string;
  description?: string;
  type: 'daily' | 'weekly' | 'monthly';
  period: {
    startDate: Date;
    endDate: Date;
  };
  budgetAmount: {
    total: number;
    currency: string;
    isPercentage: boolean;
    percentage?: number;
    revenue?: number;
  };
  nestedBudgets?: {
    daily?: { [key: string]: number };
    weekly?: { [key: string]: number };
  };
}

export interface UpdateBudgetInput {
  name?: string;
  description?: string;
  budgetAmount?: {
    total?: number;
    currency?: string;
    isPercentage?: boolean;
    percentage?: number;
    revenue?: number;
  };
  nestedBudgets?: {
    daily?: { [key: string]: number };
    weekly?: { [key: string]: number };
  };
  status?: 'active' | 'paused' | 'completed' | 'cancelled';
}

/**
 * Create a new budget
 */
export const createBudget = async (input: CreateBudgetInput): Promise<IBudget | null> => {
  try {
    await connectToDB();

    const newBudget = new Budget({
      employer: new mongoose.Types.ObjectId(input.employer),
      name: input.name,
      description: input.description,
      type: input.type,
      period: input.period,
      budgetAmount: input.budgetAmount,
      nestedBudgets: input.nestedBudgets || {},
      createdBy: new mongoose.Types.ObjectId(input.employer),
      status: 'active'
    });

    const savedBudget = await newBudget.save();
    return savedBudget;
  } catch (error: any) {
    console.error('Error creating budget:', error);
    throw new Error('Failed to create budget');
  }
};

/**
 * Get all budgets for an employer
 */
export const getEmployerBudgets = async (employerId: string): Promise<IBudget[]> => {
  try {
    await connectToDB();

    const budgets = await Budget.find({ 
      employer: new mongoose.Types.ObjectId(employerId),
      status: { $ne: 'cancelled' }
    })
    .sort({ createdAt: -1 })
    .lean();

    return budgets as unknown as IBudget[];
  } catch (error: any) {
    console.error('Error fetching employer budgets:', error);
    throw new Error('Failed to fetch budgets');
  }
};

/**
 * Get active budget for an employer
 */
export const getActiveBudget = async (employerId: string): Promise<IBudget | null> => {
  try {
    await connectToDB();

    const budget = await Budget.findOne({ 
      employer: new mongoose.Types.ObjectId(employerId),
      status: 'active'
    })
    .sort({ createdAt: -1 })
    .lean();

    return budget as unknown as IBudget | null;
  } catch (error: any) {
    console.error('Error fetching active budget:', error);
    return null;
  }
};

/**
 * Get budget by ID
 */
export const getBudgetById = async (budgetId: string): Promise<IBudget | null> => {
  try {
    await connectToDB();

    const budget = await Budget.findById(budgetId).lean();
    return budget as unknown as IBudget | null;
  } catch (error: any) {
    console.error('Error fetching budget by ID:', error);
    return null;
  }
};

/**
 * Update budget
 */
export const updateBudget = async (budgetId: string, input: UpdateBudgetInput): Promise<IBudget | null> => {
  try {
    await connectToDB();

    const updatedBudget = await Budget.findByIdAndUpdate(
      budgetId,
      { 
        ...input,
        updatedAt: new Date()
      },
      { new: true }
    ).lean();

    return updatedBudget as unknown as IBudget | null;
  } catch (error: any) {
    console.error('Error updating budget:', error);
    throw new Error('Failed to update budget');
  }
};

/**
 * Delete budget (soft delete)
 */
export const deleteBudget = async (budgetId: string): Promise<boolean> => {
  try {
    await connectToDB();

    const result = await Budget.findByIdAndUpdate(
      budgetId,
      { 
        status: 'cancelled',
        updatedAt: new Date()
      }
    );

    return !!result;
  } catch (error: any) {
    console.error('Error deleting budget:', error);
    throw new Error('Failed to delete budget');
  }
};

/**
 * Add spending to budget
 */
export const addSpending = async (budgetId: string, spendingData: {
  daily?: { [key: string]: number };
  weekly?: { [key: string]: number };
  monthly?: { [key: string]: number };
}): Promise<IBudget | null> => {
  try {
    await connectToDB();

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      throw new Error('Budget not found');
    }

    // Update spending data
    if (spendingData.daily) {
      Object.entries(spendingData.daily).forEach(([date, amount]) => {
        budget.spending.daily[date] = (budget.spending.daily[date] || 0) + amount;
      });
    }

    if (spendingData.weekly) {
      Object.entries(spendingData.weekly).forEach(([week, amount]) => {
        budget.spending.weekly[week] = (budget.spending.weekly[week] || 0) + amount;
      });
    }

    if (spendingData.monthly) {
      Object.entries(spendingData.monthly).forEach(([month, amount]) => {
        budget.spending.monthly[month] = (budget.spending.monthly[month] || 0) + amount;
      });
    }

    const savedBudget = await budget.save();
    return savedBudget;
  } catch (error: any) {
    console.error('Error adding spending to budget:', error);
    throw new Error('Failed to add spending');
  }
};

/**
 * Calculate budget analytics
 */
export const getBudgetAnalytics = async (budgetId: string) => {
  try {
    await connectToDB();

    const budget = await Budget.findById(budgetId).lean() as unknown as IBudget | null;
    if (!budget) {
      throw new Error('Budget not found');
    }

    const totalSpent = budget.spending.total;
    const totalBudget = budget.budgetAmount.total;
    const remaining = totalBudget - totalSpent;
    const utilizationPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    let status = 'healthy';
    if (utilizationPercentage >= 100) status = 'exceeded';
    else if (utilizationPercentage >= 90) status = 'critical';
    else if (utilizationPercentage >= 75) status = 'warning';

    return {
      totalBudget,
      totalSpent,
      remaining,
      utilizationPercentage,
      status,
      budget
    };
  } catch (error: any) {
    console.error('Error calculating budget analytics:', error);
    throw new Error('Failed to calculate budget analytics');
  }
};