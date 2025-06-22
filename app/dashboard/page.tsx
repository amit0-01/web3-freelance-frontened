import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardNav from "@/components/dashboard-nav"
import JobsList from "@/components/jobs-list"
import WalletBalanceCard from "@/components/walletBalanceCard"; 
import ActiveJobsCard from "@/components/active-job-cards"
import PostJobButton from "@/components/PostJobButton"


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
            <Suspense fallback={<div>Loading...</div>}>
            <PostJobButton/>
            </Suspense>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           <ActiveJobsCard/>
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

          {/* <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>Recently posted jobs that match your skills</CardDescription>
              </CardHeader>
              <CardContent> */}
              {/* <div className="md:col-span-3"> */}
              <JobsList/>
              {/* </div>
              </CardContent>
              <CardFooter>
                <Link href="/jobs">
                  <Button variant="outline">View All Jobs</Button>
                </Link>
              </CardFooter>
            </Card>
          </div> */}
        </div>
      </main>
    </div>
  )
}
