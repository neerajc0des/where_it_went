"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { CategoryIcon } from "../app/(dashboard)/categories/category-icon";
import { ICON_MAP } from "@/lib/icon-map";

interface IconPickerDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (iconKey: string) => void;
  selectedIcon: string;
}

export const IconPickerDrawer = ({ open, onClose, onSelect, selectedIcon }: IconPickerDrawerProps) => {
  const [search, setSearch] = useState("");

  const filteredIcons = Object.keys(ICON_MAP).filter((key) =>
    key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[60vh] max-w-4xl mx-auto">
        <DrawerHeader>
          <DrawerTitle>Choose an Icon</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="overflow-y-auto px-4 pb-6">
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
            {filteredIcons.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => { onSelect(key); onClose(); }}
                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all cursor-pointer ${
                  selectedIcon === key
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:bg-secondary hover:border-border"
                }`}
              >
                <CategoryIcon name={key}  />
                <span className="text-[10px] text-muted-foreground truncate w-full text-center">{key}</span>
              </button>
            ))}
          </div>
          {filteredIcons.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No icons found.</p>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};