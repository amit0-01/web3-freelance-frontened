"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardNav from "@/components/dashboard-nav"
import { useToast } from "@/hooks/use-toast"
import axiosInstance from "@/lib/axiosInstance"

interface Application {
  id: string
  coverLetter: string
  proposedRate: number
  estimatedDuration: string
  status: string
  createdAt: string
  user: {
    id: number
    name: string
    email: string
  }
}

interface JobWithApplications {
  id: number
  title: string
  description: string
  applications: Application[]
}

export default function EmployerApplications() {
  const [jobs, setJobs] = useState<JobWithApplications[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchEmployerApplications = async () => {
    try {
      const response = await axiosInstance.get("/blockchain/applications/employer")
      if (response.status === 200) {
        setJobs(response.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job applications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployerApplications()
  }, [toast])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "success"
      case "rejected":
        return "destructive"
      case "pending":
        return "warning"
      default:
        return "secondary"
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-10">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <main className="flex-1 p-6 md:p-10">
        <div className="grid gap-6">
          <h1 className="text-3xl font-bold tracking-tight">Applicants on Your Jobs</h1>

          {jobs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No job applications yet.</p>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="space-y-4">
                <h2 className="text-2xl font-semibold">{job.title}</h2>
                {job.applications.length === 0 ? (
                  <p className="text-muted-foreground">No applicants for this job yet.</p>
                ) : (
                  job.applications.map((app) => (
                    <Card key={app.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-lg">{app.user.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{app.user.email}</p>
                            <p className="text-sm text-muted-foreground">
                              Applied on {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={getStatusColor(app.status) as any}>{app.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h3 className="font-medium mb-1">Cover Letter</h3>
                            <p className="text-sm line-clamp-3">{app.coverLetter}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Proposed Rate:</span>
                              <span className="font-medium">{app.proposedRate} ETH</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Estimated Duration:</span>
                              <span className="font-medium">{app.estimatedDuration.replace(/-/g, " ")}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
