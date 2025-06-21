"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Briefcase, Wallet, Bell, User, Menu, X, LogOut, MessageSquare } from "lucide-react"
import { Logout } from "@/services/auth.service"

export default function DashboardNav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const handleLogout = () => {
    // Implement your logout logic here
    Logout()
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl">Web3Jobs</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium ${
                isActive("/dashboard") ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Dashboard
            </Link>
            <Link
              href="/jobs"
              className={`text-sm font-medium ${
                isActive("/jobs") ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Jobs
            </Link>
            <Link
              href="/payments"
              className={`text-sm font-medium ${
                isActive("/dashboard/payments") ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Payments
            </Link>
            <Link
              href="/applications"
              className={`text-sm font-medium ${
                isActive("/dashboard/applications") ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Applications
            </Link>
            <Link
              href="/messages"
              className={`text-sm font-medium ${
                isActive("/messages") ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Messages
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/messages">
              <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                <span className="sr-only">Messages</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
              <span className="sr-only">Notifications</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background md:hidden">
          <nav className="container grid gap-6 p-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/jobs"
              className="flex items-center gap-2 text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Briefcase className="h-5 w-5" />
              <span>Jobs</span>
            </Link>
            <Link
              href="/dashboard/payments"
              className="flex items-center gap-2 text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Wallet className="h-5 w-5" />
              <span>Payments</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Link
              href="/dashboard/applications"
              className="flex items-center gap-2 text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Briefcase className="h-5 w-5" />
              <span>Applications</span>
            </Link>
            <Link
              href="/messages"
              className="flex items-center gap-2 text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
