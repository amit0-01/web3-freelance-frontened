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

