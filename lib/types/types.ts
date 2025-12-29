export type BankAccountType = {
  id: string;
  name: string;
  type: string;
  currency: string;
  openingBalance: number;
  currentBalance: number;
  isActive: boolean;
  isArchived: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type TotalBalanceReturnType = {
  responseObject: {
    totalAmount: number;
    totalExpense: number;
    totalIncome: number;
  };
};

export type CreateBankAccountType = {
  name: string;
  type: string;
  currency: string;
  openingBalance: number;
  currentBalance: number;
  isActive: boolean;
  isArchived: boolean;
};

export type TotalBalanceType = {
  totalAmount: number;
  totalExpense: number;
  totalIncome: number;
};

export type RecentActivitiesType = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: any;
  accountId: string;
  createdAt: string;
};

export type RecentActivitiesReturnType = {
  responseObject: {
    data: RecentActivitiesType[];
    count: number;
    nextCursor: number;
  };
};

export type GoalType = {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  targetDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  accountId: string;
};

export type SavingGoalsReturnType = {
  responseObject: {
    data: GoalType[];
    count: number;
  };
};

export type AiInsightType = {
  type: string;
  title: string;
  message: string;
  severity: string;
  confidence: number;
  snapshotId: string;
  snapshot: string;
  userId: string;
  modelUsed: string;
  promptHash: string;
  metadata: any;
  createdAt: Date;
  expiresAt: Date;
};

export type AiInsight = {
  totalSpent: number;
  budgetLimit: number;
  daysLeft: number;
  topCategories: {
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    categoryAmount: number;
  }[];
  aiInsight: AiInsightType;
};

export type AiInsightsReturnType = {
  responseObject: {
    data: AiInsight;
  };
};

export type SpendingLimit = {
  id: string;
  amount: number;
  period: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SpendingLimitsReturnType = {
  responseObject: {
    data: SpendingLimit[];
    count: number;
  };
};
