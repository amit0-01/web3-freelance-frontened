"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardNav from "@/components/dashboard-nav"
import axiosInstance from "@/lib/axiosInstance"
import { getUserRole } from "@/lib/utils"
import { completedJob } from "@/services/transactionJobService"
import { toast } from "react-toastify"

interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  coverLetter: string
  proposedRate: number
  estimatedDuration: string
  status: string
  submittedAt: string
}

export default function UserApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const userRole = getUserRole();
  console.log('userrole', userRole);

  const fetchFreelancerApplications = async () => {
    try {
      const response = await axiosInstance.get("/blockchain/applications/me")
      console.log('response', response)
      if(response.status == 200){
        toast.success("Applications loaded successfully")
          setApplications(response.data)
      }
    } catch (error) {
      toast.error("Failed to load your applications")
    } finally {
      setIsLoading(false)
    }
  }

  // const fetchEmployerApplications = async () => {
  //   try {
  //     const response = await axiosInstance.get("/blockchain/applications/employer")
  //     console.log('response', response);
  //     if(response.status == 200){
  //       toast.success
  //         setApplications(response.data)
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to load your applications",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const handleCompleteJob = async (jobId: number) => {
    try {
      const response = await completedJob(jobId);
      if (response.status === 200) {
        toast.success("Job marked as complete successfully")
        fetchFreelancerApplications()
      }
    } catch (error) {
      toast.success("Failed to mark job as complete")
    }
  }

  useEffect(() => {
    if(userRole == 'FREELANCER'){
    fetchFreelancerApplications()
    } 
    // else if(userRole == 'ADMIN'){
    //     fetchEmployerApplications()
    // }
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
              <p className="text-muted-foreground">Track the status of your job applications</p>
            </div>
            <Link href="/jobs">
              <Button>Browse More Jobs</Button>
            </Link>
          </div>

          {applications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">You haven't applied to any jobs yet.</p>
                <Link href="/jobs">
                  <Button>Browse Available Jobs</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {applications.map((application:any) => (
                <Card key={application.id}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <CardTitle className="text-xl">
                          <Link href={`/jobs/${application.jobId}`} className="hover:underline">
                            {application.jobTitle}
                          </Link>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Applied on {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(application.status) as any}>{application.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="font-medium mb-1">Your Proposal</h3>
                        <p className="text-sm line-clamp-3">{application.coverLetter}</p>
                        <Link
                          href={`/dashboard/applications/${application.id}`}
                          className="text-sm text-primary hover:underline mt-1 inline-block"
                        >
                          View Full Application
                        </Link>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Your Bid:</span>
                          <span className="font-medium">{application.proposedRate} ETH</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Estimated Duration:</span>
                          <span className="font-medium">{application.estimatedDuration.replace(/-/g, " ")}</span>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Link href={`/jobs/${application.jobId}`}>
                            <Button variant="outline" size="sm">
                              View Job
                            </Button>
                          </Link>
                        </div>
                      
                        {
                        // application.freelancer?.toLowerCase() === currentUserAddress?.toLowerCase() &&
                          !application.job.isCompleted && application.status == 'ACCEPTED' && (
                            <div className="flex justify-end mt-2">
                              <Button
                                size="sm"
                                onClick={() => handleCompleteJob(application.jobId)}
                              >
                                Mark as Complete
                              </Button>
                            </div>
                        )}

                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
