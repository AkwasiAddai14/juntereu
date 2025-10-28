import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  employer: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  
  // Budget type and period
  type: 'daily' | 'weekly' | 'monthly';
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  // Budget amount configuration
  budgetAmount: {
    total: number;
    currency: string;
    isPercentage: boolean; // true if budget is percentage of revenue
    percentage?: number; // percentage of revenue (if isPercentage is true)
    revenue?: number; // revenue amount for percentage calculation
  };
  
  // Nested budgets (for weekly/monthly)
  nestedBudgets?: {
    daily?: {
      [key: string]: number; // date as key, amount as value
    };
    weekly?: {
      [key: string]: number; // week number as key, amount as value
    };
  };
  
  // Spending tracking
  spending: {
    daily: {
      [key: string]: number; // date as key, spent amount as value
    };
    weekly: {
      [key: string]: number; // week number as key, spent amount as value
    };
    monthly: {
      [key: string]: number; // month as key, spent amount as value
    };
    total: number; // total spent across all periods
  };
  
  // Budget status
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

const BudgetSchema = new Schema<IBudget>({
  employer: {
    type: Schema.Types.ObjectId,
    ref: 'Employer',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Budget type and period
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  
  // Budget amount configuration
  budgetAmount: {
    total: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'EUR',
      uppercase: true,
      maxlength: 3
    },
    isPercentage: {
      type: Boolean,
      default: false
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    revenue: {
      type: Number,
      min: 0
    }
  },
  
  // Nested budgets
  nestedBudgets: {
    daily: {
      type: Map,
      of: Number,
      default: new Map()
    },
    weekly: {
      type: Map,
      of: Number,
      default: new Map()
    }
  },
  
  // Spending tracking
  spending: {
    daily: {
      type: Schema.Types.Mixed,
      default: {}
    },
    weekly: {
      type: Schema.Types.Mixed,
      default: {}
    },
    monthly: {
      type: Schema.Types.Mixed,
      default: {}
    },
    total: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Budget status
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  
  // Metadata
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Employer',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
BudgetSchema.index({ employer: 1, type: 1, status: 1 });
BudgetSchema.index({ 'period.startDate': 1, 'period.endDate': 1 });
BudgetSchema.index({ createdAt: -1 });

// Virtual for remaining budget
BudgetSchema.virtual('remainingBudget').get(function() {
  return this.budgetAmount.total - this.spending.total;
});

// Virtual for budget utilization percentage
BudgetSchema.virtual('utilizationPercentage').get(function() {
  if (this.budgetAmount.total === 0) return 0;
  return (this.spending.total / this.budgetAmount.total) * 100;
});

// Virtual for budget status based on utilization
BudgetSchema.virtual('budgetStatus').get(function() {
  const utilization = this.budgetAmount.total === 0 ? 0 : (this.spending.total / this.budgetAmount.total) * 100;
  if (utilization >= 100) return 'exceeded';
  if (utilization >= 90) return 'critical';
  if (utilization >= 75) return 'warning';
  return 'healthy';
});

// Pre-save middleware to calculate total spending
BudgetSchema.pre('save', function(next) {
  if (this.isModified('spending')) {
    const dailyTotal = Object.values(this.spending.daily).reduce((sum: number, amount: unknown) => sum + (amount as number), 0);
    const weeklyTotal = Object.values(this.spending.weekly).reduce((sum: number, amount: unknown) => sum + (amount as number), 0);
    const monthlyTotal = Object.values(this.spending.monthly).reduce((sum: number, amount: unknown) => sum + (amount as number), 0);
    
    this.spending.total = dailyTotal + weeklyTotal + monthlyTotal;
  }
  next();
});

// Static method to get budgets by employer and type
BudgetSchema.statics.findByEmployerAndType = function(employerId: string, type: string) {
  return this.find({ employer: employerId, type, status: 'active' });
};

// Static method to get budgets by date range
BudgetSchema.statics.findByDateRange = function(startDate: Date, endDate: Date) {
  return this.find({
    'period.startDate': { $lte: endDate },
    'period.endDate': { $gte: startDate },
    status: 'active'
  });
};

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
