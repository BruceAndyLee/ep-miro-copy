import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// tailwind css classes merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
