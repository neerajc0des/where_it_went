"use client";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/types";

interface IncomeExpenseSwitchProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
  disabled?: boolean;
}

export const IncomeExpenseSwitch = ({ value, onChange, disabled = false }: IncomeExpenseSwitchProps) => {
  const isExpense = value === "EXPENSE";

  return (
    <div className={cn(
      "relative w-full h-full inline-flex items-center bg-secondary border border-border/60 rounded-[10px] py-0.75 px-0.50 select-none",
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
    )}>
      <div
        className={cn(
          "w-[50%]! absolute top-0.75 h-[calc(100%-6px)] rounded-[10px] border transition-all duration-200 ease-in-out pointer-events-none z-0",
          isExpense
            ? "translate-x-full bg-destructive/10 border-destructive/30"
            : "translate-x-0 bg-emerald-500/10 border-emerald-500/30"
        )}
      />
      <button
        type="button"
        onClick={() => !disabled && onChange("INCOME")}
        disabled={disabled}
        className={cn(
          "w-full relative z-10 flex items-center justify-center gap-1.5 px-5 py-1.75 text-sm font-medium rounded-[8px] transition-colors duration-200",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          !isExpense ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
        )}
      >
        <TrendingUp className="h-4 w-4" />
        Income
      </button>
      <button
        type="button"
        onClick={() => !disabled && onChange("EXPENSE")}
        disabled={disabled}
        className={cn(
          "relative z-10 w-full flex items-center justify-center gap-1.5 px-5 py-1.75 text-sm font-medium rounded-[8px] transition-colors duration-200",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          isExpense ? "text-destructive" : "text-muted-foreground"
        )}
      >
        <TrendingDown className="h-4 w-4" />
        Expense
      </button>
    </div>
  );
};