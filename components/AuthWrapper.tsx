"use client"
import { useAuthRedirect } from "@/hooks/useAuthRedirect"
import { ReactNode } from "react"

export default function AuthWrapper({ children }: { children: ReactNode }) {
  useAuthRedirect()
  return <>{children}</>
}