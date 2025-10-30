"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getUserDetails } from "@/lib/utils"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = getUserDetails()
    setIsLoggedIn(!!user)
  }, [])

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b">
      <Link href="/" className="flex items-center justify-center">
        <span className="font-bold text-xl">Web3Jobs</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {isLoggedIn ? (
          <>
            <Link href="/jobs" className="text-sm font-medium hover:underline underline-offset-4">
              Browse Jobs
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm font-medium text-muted-foreground cursor-not-allowed">
              Browse Jobs
            </span>
            <span className="text-sm font-medium text-muted-foreground cursor-not-allowed">
              About
            </span>
            <Link href="/auth/login" className="text-sm font-medium hover:underline underline-offset-4">
              Login
            </Link>
            <Link href="/auth/register" className="text-sm font-medium hover:underline underline-offset-4">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
