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
  createCategory: (payload: { name: string; icon: string; type: string; isDefault?: boolean }) => Promise<void>;
  updateCategory: (id: string, payload: { name: string; icon: string; type: string }) => Promise<boolean>;
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

  createCategory: async (payload) => {
        set({ isCategoriesLoading: true });
        try {
            const token = useAuthStore.getState().accessToken;
            const finalPayload = payload.isDefault ? payload : { ...payload, isDefault: false }        
            const response = await api.post(ENDPOINTS.categories.base, finalPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const newCategory: TransactionCategory = response.data.data;
            set((state) => ({
            customCategories: [...state.customCategories, newCategory],
            categories: [...state.categories, newCategory],
        }));
        } catch (error) {
                console.error("Failed to create category:", error);
        } finally {
                set({ isCategoriesLoading: false });
        }
  },

  updateCategory: async (id, payload) => {
    set({ isCategoriesLoading: true });
    try {
        const token = useAuthStore.getState().accessToken;
        const response = await api.patch(`${ENDPOINTS.categories.base}/${id}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const updatedCategory: TransactionCategory = response.data.data;

        set((state) => ({
            customCategories: state.customCategories.map((c) =>
                c.id === id ? updatedCategory : c
            ),
            categories: state.categories.map((c) =>
                c.id === id ? updatedCategory : c
            ),
        }));

        return true;
    } catch (error) {
        console.error("Failed to update category:", error);
        return false;
    } finally {
        set({ isCategoriesLoading: false });
    }
    },
});