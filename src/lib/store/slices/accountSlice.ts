import { StateCreator } from "zustand";
import { FinanceStore } from "../warehouseStore";
import api from "@/lib/api";
import { ApiResponse, Account } from "@/types";

export interface AccountSlice {
  accounts: Account[];
  isAccountsLoading: boolean;
  fetchAccounts: () => Promise<void>;
}

export const createAccountSlice: StateCreator<FinanceStore, [], [], AccountSlice> = (set) => ({
  accounts: [],
  isAccountsLoading: false,
  fetchAccounts: async () => {
    set({ isAccountsLoading: true });
    try {
        const response = await api.get<ApiResponse<Account[]>>("/accounts");
        set({ accounts: response.data.data });
    } catch (error) {
        console.error("Failed to fetch accounts:", error);
    } finally {
        set({ isAccountsLoading: false });
    }
  },
});