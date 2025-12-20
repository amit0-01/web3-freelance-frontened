"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getUserDetails } from "@/lib/utils"
import { motion } from "framer-motion"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = getUserDetails()
    setIsLoggedIn(!!user)
  }, [])

  return (
    <motion.header
      className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      <Link className="flex items-center justify-center" href="/">
        <motion.span
          className="font-bold text-xl"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Web3Jobs
        </motion.span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        {isLoggedIn ? (
          <>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/jobs">
              Jobs
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/dashboard">
              Dashboard
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("user")
                  window.location.href = "/auth/login"
                }}
              >
                Logout
              </Button>
            </motion.div>
          </>
        ) : (
          <>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/auth/login">
              Login
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </motion.div>
          </>
        )}
      </nav>
    </motion.header>
  )
}
