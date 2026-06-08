import { StateCreator } from "zustand";
import { FinanceStore } from "../warehouseStore";
import api from "@/lib/api";
import { ApiResponse, Account } from "@/types";
import { useAuthStore } from "../authStore";
import { ENDPOINTS } from "@/lib/constants";

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
        const token = useAuthStore.getState().accessToken;
        const response = await api.get(`${ENDPOINTS.accounts.base}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        set({ accounts: response.data.data });
    } catch (error) {
        console.error("Failed to fetch accounts:", error);
    } finally {
        set({ isAccountsLoading: false });
    }
  },
});