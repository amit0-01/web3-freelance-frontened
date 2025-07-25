"use client"
import { Suspense, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardNav from "@/components/dashboard-nav"
import JobsList from "@/components/jobs-list"
import { getUserRole } from "@/lib/utils"
import PostJobButton from "@/components/PostJobButton"

export default function JobsPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <main className="flex-1 p-6 md:p-10">
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Browse Jobs</h1>
              <p className="text-muted-foreground">Find your next opportunity in the Web3 space</p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
            <PostJobButton/>
            </Suspense>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-3">
              <div className="relative">
                <Input placeholder="Search jobs..." className="pl-10" 
                onChange={(e) => setSearch(e.target.value)}/>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <Select defaultValue="newest">
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="highest-paid">Highest Paid</SelectItem>
                  <SelectItem value="ending-soon">Ending Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
          {getUserRole() == 'FREELANCER' &&  <div className="space-y-6 md:col-span-1">
              <div className="space-y-2">
                <h3 className="font-medium">Categories</h3>
                <div className="space-y-1">
                <Button
                variant="ghost"
                className={`w-full justify-start ${selectedCategory === 'All' ? 'bg-muted font-semibold' : ''}`}
                onClick={() => handleCategoryClick('All')}
              >
                All Categories
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${selectedCategory === 'Development' ? 'bg-muted font-semibold' : ''}`}
                onClick={() => handleCategoryClick('Development')}
              >
                Development
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${selectedCategory === 'Design' ? 'bg-muted font-semibold' : ''}`}
                onClick={() => handleCategoryClick('Design')}
              >
                Design
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${selectedCategory === 'Marketing' ? 'bg-muted font-semibold' : ''}`}
                onClick={() => handleCategoryClick('Marketing')}
              >
                Marketing
              </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Payment Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Min" />
                  <Input placeholder="Max" />
                </div>
                <Button variant="outline" className="w-full">
                  Apply Filter
                </Button>
              </div>
            </div> }

            <div className="md:col-span-3">
                <JobsList search={search} category={selectedCategory}  />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
