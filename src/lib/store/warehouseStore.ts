import { create } from "zustand";
import { AccountSlice, createAccountSlice } from "./slices/accountSlice";
import { CategorySlice, createCategorySlice } from "./slices/categorySlice";
import { createTransactionSlice, TransactionSlice } from "./slices/transactionSlice";

export type FinanceStore = CategorySlice & AccountSlice & TransactionSlice;

export const useFinanceStore = create<FinanceStore>((...a) => ({
  ...createCategorySlice(...a),
  ...createAccountSlice(...a),
  ...createTransactionSlice(...a),
}));