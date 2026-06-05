import { StateCreator } from "zustand";
import { FinanceStore } from "../warehouseStore";
import api from "@/lib/api";
import { Account, ApiResponse, Transaction, TransactionFilters } from "@/types";

export interface TransactionSlice {
  transactions: Transaction[];
  isTransactionsLoading: boolean;
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  addTransaction: (txData: Omit<Transaction, "id" | "createdAt" | "hourOfDay" | "dayOfWeek">) => Promise<boolean>;
}

export const createTransactionSlice: StateCreator<FinanceStore, [], [], TransactionSlice> = (set) => ({
  transactions: [],
  isTransactionsLoading: false,
  fetchTransactions: async (filters) => {
        set({ isTransactionsLoading: true });
        try {
            const response = await api.get<ApiResponse<Transaction[]>>("/transactions", { params: filters });
            set({ transactions: response.data.data });
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            set({ isTransactionsLoading: false });
        }
  },

  addTransaction: async (txData) => {
    try {
      const response = await api.post<ApiResponse<Transaction>>("/transactions", txData);
      const newTransaction = response.data.data;

      set((state:any) => {
        const updatedTransactions = [newTransaction, ...state.transactions];

        // 2. Adjust local account balance using string-to-number safe mutation parsing
        const updatedAccounts = state.accounts.map((acc:Account) => {
          if (acc.id === newTransaction.account.id) {
            const currentBalance = parseFloat(acc.balance);
            const delta = parseFloat(newTransaction.amount);
            const newBalance = newTransaction.type === "EXPENSE" ? currentBalance - delta : currentBalance + delta;
            
            return {
              ...acc,
              balance: newBalance.toFixed(2), 
            };
          }
          return acc;
        });

        return {
          transactions: updatedTransactions,
          accounts: updatedAccounts,
        };
      });

      return true;
    } catch (error) {
      console.error("Failed to add transaction:", error);
      return false;
    }
  },
});