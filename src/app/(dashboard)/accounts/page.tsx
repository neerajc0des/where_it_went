"use client"
import { useFinanceStore } from '@/lib/store/warehouseStore';
import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { CategoryIcon } from '../categories/category-icon';

export default function AccountsPage() {
  const accounts = useFinanceStore((state) => state.accounts);
  const fetchAccounts = useFinanceStore((state) => state.fetchAccounts);
  const isLoading = useFinanceStore((state) => state.isAccountsLoading);

  React.useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">Loading accounts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Accounts</h2>
      </div>

      {accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-xl border-border">
          <p className="text-sm text-muted-foreground">No accounts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {accounts.map((account) => (
            <Card key={account.id} className="cursor-pointer overflow-hidden border border-border/60 hover:bg-secondary hover:border-accent-foreground/20 transition-all shadow-xs">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center justify-between overflow-hidden flex-1">
                  <div className="left flex items-center gap-3 overflow-hidden flex-1">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                      <CategoryIcon name={account.icon} />
                    </div>
                    <div className="flex flex-col overflow-hidden text-left">
                      <span className="truncate text-sm font-medium capitalize text-foreground">
                        {account.name}
                      </span>
                      <span className="text-sm text-muted-foreground capitalize">
                        5 Transactions
                      </span>
                    </div>
                  </div>
                  <div className="right flex flex-col items-end">
                    <span className='text-lg text-muted-foreground capitalize font-bold'>INR</span>
                    <span className={`text-xl font-bold capitalize ${account.balance < 0
                      ? "text-red-500 dark:text-red-400"
                      : "text-foreground"
                      }`}>
                      {account.balance < 0 &&
                        <span>-&nbsp;</span>
                      }
                      ₹{Math.abs(account.balance)?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}