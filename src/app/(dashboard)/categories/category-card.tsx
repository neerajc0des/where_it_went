"use client";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryIcon } from "./category-icon";
import { TransactionCategory } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";


interface CategoryCardProps {
    category: TransactionCategory;
    onDelete: (id: string) => void;
    onCardClick: (category: TransactionCategory) => void;
}

export const CategoryCard = ({ category, onDelete, onCardClick }: CategoryCardProps) => {
    return (
        <>
            <Card
                onClick={() => onCardClick(category)}
                className="cursor-pointer overflow-hidden border border-border/60 hover:bg-secondary hover:border-accent-foreground/20 transition-all shadow-xs"
            >
                <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
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

                    {!category.isDefault && (
                        <Tooltip>
                            <TooltipTrigger
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(category.id);
                                }}
                                className="p-2 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer focus-visible:outline-none"
                            >
                                <Trash2 className="h-5 w-5" />
                            </TooltipTrigger>
                            <TooltipContent side="top">Delete</TooltipContent>
                        </Tooltip>
                    )}
                </CardContent>
            </Card>
        </>
    );
};