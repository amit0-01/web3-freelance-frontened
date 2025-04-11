import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardNav from "@/components/dashboard-nav"
import JobsList from "@/components/jobs-list"
import { Skeleton } from "@/components/ui/skeleton"
import WalletBalanceCard from "@/components/walletBalanceCard"; // Move balance fetching to a client component


export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <main className="flex-1 p-6 md:p-10">
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to your Web3Jobs dashboard.</p>
            </div>
            <Link href="/jobs/post">
              <Button>Post a New Job</Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Jobs</CardTitle>
                <CardDescription>Jobs you've posted or applied to</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/jobs">
                  <Button variant="ghost" className="h-8 px-2 text-sm">
                    View all
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Pending Payments</CardTitle>
                <CardDescription>Payments waiting to be released</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/payments">
                  <Button variant="ghost" className="h-8 px-2 text-sm">
                    View all
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Suspense fallback={<div>Loading wallet balance...</div>}>
            <WalletBalanceCard />
          </Suspense>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>Recently posted jobs that match your skills</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<JobsListSkeleton />}>
                  <JobsList limit={5} />
                </Suspense>
              </CardContent>
              <CardFooter>
                <Link href="/jobs">
                  <Button variant="outline">View All Jobs</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function JobsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
    </div>
  )
}

