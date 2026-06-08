import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import { TransactionCategory } from "@/types";
import { FinanceStore } from "../warehouseStore";
import { StateCreator } from "zustand";
import { useAuthStore } from "../authStore";
import axios from "axios";

export interface CategorySlice {
    defaultCategories: TransactionCategory[];
    customCategories: TransactionCategory[];
    categories: TransactionCategory[];
    isCategoriesLoading: boolean;
    fetchCategories: () => Promise<void>;
    createCategory: (payload: { name: string; icon: string; type: string; isDefault?: boolean }) => Promise<boolean>;
    updateCategory: (id: string, payload: { name: string; icon: string; type: string }) => Promise<boolean>;
    deleteCategory: (id: string) => Promise<boolean>;
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
            const response = await api.get(`${ENDPOINTS.categories.base}`, {
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
            return true;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Failed to create category");
            }
            throw new Error("Failed to create category");
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
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Failed to update category");
            }
            throw new Error("Failed to create category");
        } finally {
            set({ isCategoriesLoading: false });
        }
    },

    deleteCategory: async (id) => {
        set({ isCategoriesLoading: true });
        try {
            const token = useAuthStore.getState().accessToken;
            const response = await api.delete(`${ENDPOINTS.categories.base}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            set((state) => ({
                customCategories: state.customCategories.filter((c) => c.id !== id),
                categories: state.categories.filter((c) => c.id !== id),
            }));

            return true;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Failed to delete category");
            }
            throw new Error("Failed to create category");
        } finally {
            set({ isCategoriesLoading: false });
        }
    },
});