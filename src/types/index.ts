export type TransactionType = 'EXPENSE' | 'INCOME';

export type AccountType = 'BANK' | 'CASH' | 'WALLET' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'SAVINGS' | 'UPI';

export type MoodType = 'HAPPY' | 'NEUTRAL' | 'ANXIOUS' | 'STRESSED' | 'SAD';

export type RecapType = 'MONTHLY' | 'YEARLY';

export type BudgetPeriod = 'MONTHLY' | 'YEARLY';

export type NudgeType = 'IMPULSE_PATTERN' | 'MOOD_SPENDING' | 'BALANCE_WARNING' | 'PERSONALITY_INSIGHT';

export type TokenType = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';


// api response 
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Core Data Models
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    googleId?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Session {
    id: string;
    deviceName?: string;
    ipAddress?: string;
    createdAt: string;
    expiresAt: string;
}

export interface Account {
  id: string;
  name: string;
  icon: string;
  balance: number;
  monthlyBudget?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
  isDefault: boolean;
  createdAt: string;
}

export interface CategoriesResponse {
  categories: TransactionCategory[];
}

export interface Transaction {
  id: string;
  amount: string;
  type: TransactionType;
  categoryId: string;
  category: Pick<TransactionCategory, 'id' | 'name' | 'icon' | 'type'>;
  account: Pick<Account, 'id' | 'name'>;
  merchant?: string;
  note?: string;
  date: string;
  hourOfDay: number;
  dayOfWeek: number;
  isImpulse: boolean;
  createdAt: string;
}

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface Mood {
  id: string;
  mood: MoodType;
  note?: string;
  loggedAt: string;
  hourOfDay: number;
}

export interface MoodStats {
  totalEntries: number;
  frequency: Record<MoodType, number>;
  mostCommonMood: MoodType;
  mostActiveHour: number;
  avgSpendingPerMood: Record<MoodType, number>;
}

export interface Recap {
  id: string;
  type: RecapType;
  periodLabel: string;
  startDate: string;
  endDate: string;
  totalSpent: string;
  totalIncome: string;
  netChange: string;
  topCategory: string;
  highestSpend: string;
  lowestSpend: string;
  transactionCount: number;
  categoryBreakdown: Record<string, number>;
  accountBreakdown: Record<string, number>;
  personalityLabel?: string;
  moodCorrelation?: string;
  generatedAt: string;
}

export interface Nudge {
  id: string;
  message: string;
  type: NudgeType;
  isRead: boolean;
  createdAt: string;
}

export interface SmartEntryResult {
  transaction: Transaction;
  aiExtracted: {
    amount: number;
    merchant: string;
    category: string;
    account: string;
    type: TransactionType;
    note: string;
    isImpulse: boolean;
  };
}

// authentication
export interface AuthResponse {
  user?: User;
  userId?: string;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}