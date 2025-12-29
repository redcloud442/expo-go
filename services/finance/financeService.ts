import { api } from "@/lib/api/api";
import { CreateGoalFormValues } from "@/lib/schema/finance/financeSchema";
import {
  AiInsight,
  AiInsightsReturnType,
  BankAccountType,
  CreateBankAccountType,
  GoalType,
  RecentActivitiesReturnType,
  SavingGoalsReturnType,
  SpendingLimitsReturnType,
  TotalBalanceReturnType,
} from "@/lib/types/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const financeService = {
  getBankAccounts: async () => {
    const response = await api<BankAccountType[]>(
      "/api/finance/bank-accounts",
      {
        method: "GET",
      }
    );

    return response;
  },
  createBankAccount: async (bankAccount: CreateBankAccountType) => {
    console.log(bankAccount);
    const response = await api<BankAccountType>(
      "/api/finance/bank-accounts/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bankAccount),
      }
    );

    return response;
  },
  updateBankAccount: async (bankAccount: BankAccountType) => {
    const response = await api<BankAccountType>(
      `/api/finance/bank-accounts/update/${bankAccount.id}`,
      {
        method: "PUT",
        body: JSON.stringify(bankAccount),
      }
    );

    return response;
  },
  deleteBankAccount: async (id: string) => {
    const response = await api<BankAccountType>(
      `/api/finance/bank-accounts/delete/${id}`,
      {
        method: "DELETE",
      }
    );

    return response;
  },
  getTotalBalance: async () => {
    const response = await api<TotalBalanceReturnType>(
      "/api/finance/bank-accounts/total-expense-and-income",
      {
        method: "GET",
      }
    );

    const { responseObject } = response;
    return responseObject;
  },
  getRecentActivities: async (params: { take: number; skip: number }) => {
    const response = await api<RecentActivitiesReturnType>(
      `/api/finance/recent-activities?take=${params.take}&skip=${params.skip}`,
      {
        method: "GET",
      }
    );

    const { responseObject } = response;

    return responseObject;
  },
  getGoals: async (params: { take: number; skip: number }) => {
    const response = await api<SavingGoalsReturnType>(
      `/api/finance/saving-goals?take=${params.take}&skip=${params.skip}`,
      {
        method: "GET",
      }
    );

    const { responseObject } = response;
    return responseObject;
  },
  createGoal: async (goal: CreateGoalFormValues) => {
    const response = await api<GoalType>(
      `/api/finance/saving-goals/create/${goal.accountId}`,
      {
        method: "POST",
        body: JSON.stringify({
          name: goal.name,
          targetAmount: goal.targetAmount,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  },
  addFundsToGoal: async (data: {
    goalId: string;
    targetAmount: number;
    bankAccountId: string;
    currentAmount: number;
  }) => {
    const response = await api<GoalType>(
      `/api/finance/saving-goals/add-funds/${data.goalId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          targetAmount: data.targetAmount,
          bankAccountId: data.bankAccountId,
          currentAmount: data.currentAmount,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  },
  getAiInsights: async () => {
    const response = await api<AiInsightsReturnType>(
      "/api/finance/insights-data",
      {
        method: "GET",
      }
    );

    const { responseObject } = response;
    return responseObject as unknown as AiInsight;
  },

  getSpendingLimits: async () => {
    const response = await api<SpendingLimitsReturnType>(
      "/api/finance/spending-limits",
      {
        method: "GET",
      }
    );
    const { responseObject } = response;
    return responseObject;
  },
};

export const getBankAccounts = () => {
  return useQuery({
    queryKey: ["bank-accounts"],
    queryFn: financeService.getBankAccounts,
  });
};

export const getTotalBalance = () => {
  return useQuery({
    queryKey: ["total-balance"],
    queryFn: financeService.getTotalBalance,
  });
};

export const getRecentActivities = (params: { take: number; skip: number }) => {
  return useInfiniteQuery({
    queryKey: ["recent-activities", params],
    queryFn: () => financeService.getRecentActivities(params),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 10,
  });
};

export const getGoals = (params: { take: number; skip: number }) => {
  return useQuery({
    queryKey: ["goals", params],
    queryFn: () => financeService.getGoals(params),
    initialData: {
      data: [],
      count: 0,
    },
  });
};

export const getAiInsights = () => {
  return useQuery({
    queryKey: ["ai-insights"],
    queryFn: financeService.getAiInsights,
  });
};

export const getSpendingLimits = () => {
  return useQuery({
    queryKey: ["spending-limits"],
    queryFn: financeService.getSpendingLimits,
  });
};

export const createBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["bank-accounts"],
    mutationFn: financeService.createBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const updateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["bank-accounts"],
    mutationFn: financeService.updateBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const deleteBankAccount = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["bank-accounts"],
    mutationFn: financeService.deleteBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
  });
};
