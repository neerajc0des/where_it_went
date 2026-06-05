import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import { ApiResponse, CategoriesResponse, TransactionCategory } from "@/types";
import { FinanceStore } from "../warehouseStore";
import { StateCreator } from "zustand";
import { use } from "react";
import { useAuthStore } from "../authStore";

export interface CategorySlice {
  defaultCategories: TransactionCategory[];
  customCategories: TransactionCategory[];
  categories: TransactionCategory[];
  isCategoriesLoading: boolean;
  fetchCategories: () => Promise<void>;
}

export const createCategorySlice: StateCreator<FinanceStore, [], [], CategorySlice> = (set) => ({
  defaultCategories: [],
  customCategories: [],
  categories: [],
  isCategoriesLoading: false,

  fetchCategories: async () => {
    set({ isCategoriesLoading: true });
    try {

        const token = useAuthStore.getState().accessToken;
        const response = await api.get(`${ENDPOINTS.categories.base}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { defaultCategories, customCategories } = response.data.data;
        set({ 
            defaultCategories: defaultCategories,
            customCategories: customCategories,
            categories: [...(defaultCategories || []), ...(customCategories || [])] 
        });
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    } finally {
        set({ isCategoriesLoading: false });
    }
  },
});