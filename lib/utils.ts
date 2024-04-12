import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function middleEllipsis(s: string, n = 10): string {
  if (s.length < n) return s;
  const start = s.slice(0, n / 2);
  const end = s.slice(-(n / 2));
  return start + "..." + end;
}

export function formatBalance(balance: string) {
  return Number(balance.split(" ")[0]).toFixed(2)
}
