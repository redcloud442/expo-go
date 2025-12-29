import { AccountType } from "@/lib/constant/enum";
import * as z from "zod";

export const bankAccountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(AccountType),
  currency: z.string(),
  openingBalance: z.number().min(0, "Must be at least 0"),
  currentBalance: z.number().min(0, "Must be at least 0"),
  isActive: z.boolean(),
  isArchived: z.boolean(),
});

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>;

export const goalSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  target: z.coerce.number().min(1, "Target must be at least ₱1"),
  current: z.coerce.number().min(0).default(0),
  icon: z.string().default("star"),
  color: z.string().default("#6200ee"),
});

export type GoalFormValues = z.infer<typeof goalSchema>;

export const createGoalSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  targetAmount: z.coerce.number().min(1, "Target must be at least ₱1"),
  accountId: z.string().min(1, "Account is required"),
});

export type CreateGoalFormValues = z.infer<typeof createGoalSchema>;
