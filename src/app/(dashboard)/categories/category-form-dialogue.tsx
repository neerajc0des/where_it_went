"use client";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryIcon } from "./category-icon";
import { IncomeExpenseSwitch } from "@/components/income-expense-switch";
import { IconPickerDrawer } from "@/components/icon-picker";
import { TransactionType } from "@/types";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const categorySchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name is too long"),
    icon: z.string().min(1, "Icon is required"),
    type: z.enum(["INCOME", "EXPENSE"]),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "add" | "edit";
    defaultName?: string;
    defaultIcon?: string;
    defaultType?: TransactionType;
    onSubmit: (data: CategoryFormValues) => Promise<void>;
}

export const CategoryFormDialog = ({
    open,
    onOpenChange,
    mode,
    defaultName = "",
    defaultIcon = "tag",
    defaultType = "EXPENSE",
    onSubmit,
}: CategoryFormDialogProps) => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: defaultName,
            icon: defaultIcon,
            type: defaultType,
        },
    });

    React.useEffect(() => {
        if (open) {
            reset({ name: defaultName, icon: defaultIcon, type: defaultType });
        }
    }, [open]);

    const selectedIcon = watch("icon");

    const handleFormSubmit = async (data: CategoryFormValues) => {
        await onSubmit(data);
        onOpenChange(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {mode === "add" ? "Add Category" : "Edit Category"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">

                        <Controller
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <div className="w-full h-14">
                                    <IncomeExpenseSwitch
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={mode === "edit"}
                                    />
                                </div>
                            )}
                        />

                        <div className="flex items-center gap-4">
                            <div
                                onClick={() => setDrawerOpen(true)}
                                className="flex cursor-pointer hover:opacity-90 h-20 w-20 shrink-0 items-center justify-center rounded-full bg-secondary border border-border"
                            >
                                <CategoryIcon name={selectedIcon} />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <Input
                                    id="name"
                                    className="h-14"
                                    placeholder="Category name"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-xs text-destructive">{errors.name.message}</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-accent transition-colors cursor-pointer">
                                Cancel
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                                {isSubmitting ? "Saving..." : mode === "add" ? "Add" : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>

            <IconPickerDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSelect={(icon) => setValue("icon", icon)}
                selectedIcon={selectedIcon}
            />
        </>
    );
};