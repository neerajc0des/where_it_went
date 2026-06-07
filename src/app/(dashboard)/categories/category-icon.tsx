"use client";

import { Icon } from "@iconify/react";
import { ICON_MAP } from "@/lib/icon-map";

interface CategoryIconProps {
  name: string | null;
}

export function CategoryIcon({ name }: CategoryIconProps) {
  const iconKey = name 
    ? ICON_MAP[name.toLowerCase()] || `streamline-kameleon-color:${name}` 
    : "streamline-kameleon-color:eco-tag-duo";

  return (
    <Icon 
      icon={iconKey} 
      className="shrink-0 w-full h-full"
    />
  );
}