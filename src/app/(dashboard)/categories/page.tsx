"use client";

import * as React from "react";
import { Search, Plus, Trash, Trash2, Pen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "./category-icon"; // Path to your helper icon file
import { cn } from "@/lib/utils";
import { useFinanceStore } from "@/lib/store/warehouseStore";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CategoryCard } from "./category-card";


export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("ALL");

 
  const categories = useFinanceStore((state) => state.categories);
  const fetchCategories = useFinanceStore((state) => state.fetchCategories);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = React.useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "ALL" || category.type === activeTab;
      return matchesSearch && matchesTab;
    }).sort((a,b)=>a.name.localeCompare(b.name));
  }, [categories, searchQuery, activeTab]);

  const handleCategoryDelete = async ()=>{
    console.log("hello")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="grid w-full grid-cols-3 h-10">
              <TabsTrigger className={"cursor-pointer"} value="ALL">All</TabsTrigger>
              <TabsTrigger className={"cursor-pointer"} value="INCOME">Income</TabsTrigger>
              <TabsTrigger className={"cursor-pointer"} value="EXPENSE">Expenses</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button className="h-10 gap-2 cursor-pointer">
            <Plus className="h-4 w-4" /> Add Custom
          </Button>
        </div>
      </div>
      {filteredCategories.length > 0 ? (
            <div className="flex flex-col gap-6">
          
          {filteredCategories.filter(c => c.isDefault).length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-medium text-muted-foreground px-1">Default Categories</h3>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredCategories.filter(c => c.isDefault).map((category) => (
                  <CategoryCard key={category.id} category={category} onDelete={handleCategoryDelete} />
                ))}
              </div>
            </div>
          )}

          {filteredCategories.filter(c => !c.isDefault).length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-medium text-muted-foreground px-1">My Categories</h3>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredCategories.filter(c => !c.isDefault).map((category) => (
                  <CategoryCard key={category.id} category={category} onDelete={handleCategoryDelete} />
                ))}
              </div>
            </div>
          )}

        </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-xl border-border">
                <p className="text-sm text-muted-foreground">No categories found matching your filter criteria.</p>
              </div>
            )}
            
          </div>
        );
      }