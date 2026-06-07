"use client";

import * as React from "react";
import { Search, Plus, Trash, Trash2, Pen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinanceStore } from "@/lib/store/warehouseStore";
import { CategoryCard } from "./category-card";
import { toast } from "sonner";
import { TransactionCategory, TransactionType } from "@/types";
import { CategoryFormDialog } from "./category-form-dialogue";


export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("ALL");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<TransactionCategory | null>(null);


  const categories = useFinanceStore((state) => state.categories);
  const fetchCategories = useFinanceStore((state) => state.fetchCategories);
  const createCategory = useFinanceStore((state) => state.createCategory);
  const updateCategory = useFinanceStore((state) => state.updateCategory);
  const deleteCategory = useFinanceStore((state) => state.deleteCategory);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = React.useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "ALL" || category.type === activeTab;
      return matchesSearch && matchesTab;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, searchQuery, activeTab]);

  const handleCardClick = (category: TransactionCategory) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleAddCategoryClick = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };


  const handleAddClick = () => {
    setSelectedCategory(null);  
    setDialogOpen(true);
  };

  const handleCreateCategory = async (data: { name: string; icon: string; type: TransactionType; isDefault?: boolean }) => {
    try {
      data = { ...data, isDefault: false }
      const res = await createCategory(data);

      if (res)
        toast.success("Category created successfully");
    } catch {
      toast.error("Failed to create category");
    }
  };

  const handleUpdateCategory = async (data: { name: string; icon: string; type: TransactionType }) => {
    if (!selectedCategory) return;
    try {
      const res = await updateCategory(selectedCategory.id, data);
      if (res)
        toast.success("Category updated");
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!selectedCategory) return;
    try {
      const res = await deleteCategory(id);
      if (res)
        toast.success("Category deleted successfully");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handleSubmit = async (data: { name: string; icon: string; type: TransactionType }) => {
    if (selectedCategory) {
      await handleUpdateCategory(data);
    } else {
      await handleCreateCategory(data);
    }
  };




  return (
    <>
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

            <Button onClick={handleAddCategoryClick} className="h-10 gap-2 cursor-pointer">
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
                    <CategoryCard key={category.id} category={category} onDelete={handleDeleteCategory} onCardClick={handleCardClick} />
                  ))}
                </div>
              </div>
            )}

            {filteredCategories.filter(c => !c.isDefault).length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-muted-foreground px-1">My Categories</h3>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {filteredCategories.filter(c => !c.isDefault).map((category) => (
                    <CategoryCard key={category.id} category={category} onDelete={handleDeleteCategory} onCardClick={handleCardClick} />
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
      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={selectedCategory ? "edit" : "add"}
        defaultName={selectedCategory?.name}
        defaultIcon={selectedCategory?.icon}
        defaultType={selectedCategory?.type}
        onSubmit={handleSubmit}
      />
    </>
  );
}