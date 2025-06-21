import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { storageService } from "./storageService";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isServer = () => typeof window === "undefined";


export function getUserDetails(){
  const user:any = storageService.getItem('user');
  return user.user;
}

export function getUserRole(){
  const user:any = storageService.getItem('user');
  return user?.user?.role;
}


// utils.ts or utils/index.ts

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}


