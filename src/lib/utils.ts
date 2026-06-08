import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const highlightElement = (selector: string, duration = 2000) => {
  const element = document.querySelector(selector);
  if (!element) return;

  element.scrollIntoView({ behavior: "smooth", block: "center" });
  element.classList.add("ring-2", "ring-primary/80");

  setTimeout(() => {
    element.classList.remove("ring-2", "ring-primary/80");
  }, duration);
};