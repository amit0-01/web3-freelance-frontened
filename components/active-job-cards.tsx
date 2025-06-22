"use client"

import { useEffect, useState } from "react"
import { getUserRole } from "@/lib/utils"
import axiosInstance from "@/lib/axiosInstance"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import Link from "next/link"
import { Button } from "./ui/button"
import { fetchActiveJobsCount } from "@/services/dashboardService"

export default function ActiveJobsCard() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    getJobCount();
  }, [])

  const getJobCount = async () => {
    const role = getUserRole()
    const result = await fetchActiveJobsCount(role)
    setCount(result.data.length)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Active Jobs</CardTitle>
        <CardDescription>Jobs you've {getUserRole() == 'ADMIN' ? 'applied to' : 'posted'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{count}</div>
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/jobs">
            <Button className="h-8 px-2 text-sm" variant="ghost">
            View all
            </Button>
        </Link>
        </CardFooter>
    </Card>
  )
}
