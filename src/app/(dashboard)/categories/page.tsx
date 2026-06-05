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
    });
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
                {filteredCategories.map((category) => (
                  <Card key={category.id} className="overflow-hidden border border-border/60 hover:bg-secondary hover:border-accent-foreground/20 cursor-pointer  transition-all shadow-xs">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                        )}>
                          <CategoryIcon name={category.icon} />
                        </div>
                        <div className="flex flex-col overflow-hidden text-left">
                          <span className="truncate text-sm font-medium capitalize text-foreground">
                            {category.name}
                          </span>
                          <span className="text-sm text-muted-foreground capitalize">
                            {category.type.toLowerCase()}
                          </span>
                        </div>
                      </div>
      
                        <div className={category.isDefault ? "cursor-not-allowed" : ""}>
                          <Button 
                            disabled={category.isDefault} 
                            onClick={handleCategoryDelete} 
                            variant="ghost" 
                            className="group h-11 w-11 p-0 cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                          >
                            <Trash2 className="w-5! h-5! stroke-[2px] stroke-destructive/70 transition-all duration-200 group-hover:fill-destructive/70 group-hover:scale-105" />
                          </Button>
                        </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-xl border-border">
          <p className="text-sm text-muted-foreground">No categories found matching your filter criteria.</p>
        </div>
      )}
      
    </div>
  );
}