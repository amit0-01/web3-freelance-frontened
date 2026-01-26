"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardNav from "@/components/dashboard-nav"
import axiosInstance from "@/lib/axiosInstance"
import { toast } from "react-toastify"
import { changeApplicationStatus } from "@/services/employerJobService"
import { Calendar, Clock, Wallet, Mail, ChevronDown, ChevronUp, Briefcase } from "lucide-react"
import { JobWithApplications } from "@/types/application.interface"


export default function EmployerApplications() {
  const [jobs, setJobs] = useState<JobWithApplications[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null)
  const [hasMounted, setHasMounted] = useState(false)

  // 1. Fix Hydration: Set mount state to true on client-side
  useEffect(() => {
    setHasMounted(true)
    fetchEmployerApplications()
  }, [])

  const toggleExpand = (id: string) => {
    setExpandedAppId(expandedAppId === id ? null : id)
  }

  const fetchEmployerApplications = async () => {
    try {
      const response = await axiosInstance.get("/blockchain/applications/employer")
      if (response.status === 200) {
        setJobs(response.data)
      }
    } catch (error) {
      toast.error("Failed to fetch applications")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
      case "rejected":
        return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400"
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const handleApplicationStatus = async (
    applicationId: string,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      const response = await changeApplicationStatus(Number(applicationId), status)
      if (response.status === 200) {
        toast.success(`Application ${status.toLowerCase()} successfully`)
        setJobs((prevJobs) =>
          prevJobs.map((job) => ({
            ...job,
            applications: job.applications.map((app) =>
              app.id.toString() === applicationId.toString() ? { ...app, status } : app
            ),
          }))
        )
      }
    } catch (error) {
      console.error("Error updating application status:", error)
      toast.error("Failed to update application status")
    }
  }

  // Prevent rendering before hydration to avoid UI mismatch errors
  if (!hasMounted) return null

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950">
        <DashboardNav />
        <main className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
            <p className="text-sm text-muted-foreground animate-pulse">Loading applicants...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950">
      <DashboardNav />
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        <div className="space-y-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Applicants on Your Jobs</h1>
            <p className="text-muted-foreground">Review and manage incoming proposals for your listings.</p>
          </div>

          {jobs.length === 0 ? (
            <Card className="border-dashed shadow-none bg-transparent py-20">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No applications yet</h3>
                <p className="text-muted-foreground max-w-sm">When freelancers apply to your jobs, they will appear here for your review.</p>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <section key={job.id} className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-2">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{job.title}</h2>
                  <Badge variant="outline" className="ml-auto font-normal">
                    {job.applications.length} {job.applications.length === 1 ? 'Applicant' : 'Applicants'}
                  </Badge>
                </div>

                <div className="grid gap-4">
                  {job.applications.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic pl-4">No applicants for this job yet.</p>
                  ) : (
                    job.applications.map((app) => (
                      <Card key={app.id} className="overflow-hidden transition-all hover:shadow-md border-slate-200 dark:border-slate-800">
                        <CardHeader className="pb-3 bg-white dark:bg-slate-900">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {app.user.name.charAt(0)}
                              </div>
                              <div>
                                <CardTitle className="text-base font-semibold">{app.user.name}</CardTitle>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {app.user.email}</span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> 
                                    Applied {new Date(app.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(app.status)} px-3 py-1 capitalize border`} variant="outline">
                              {app.status.toLowerCase()}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="bg-white/50 dark:bg-slate-900/50">
                          <div className="grid gap-6 md:grid-cols-3">
                            <div className="md:col-span-2">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Cover Letter</h3>
                              <p className={`text-sm leading-relaxed text-slate-600 dark:text-slate-400 ${expandedAppId === app.id ? '' : 'line-clamp-3'}`}>
                                {app.coverLetter}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 h-8 text-primary hover:text-primary hover:bg-primary/5 p-0"
                                onClick={() => toggleExpand(app.id)}
                              >
                                {expandedAppId === app.id ? (
                                  <span className="flex items-center gap-1">Show less <ChevronUp className="h-3 w-3" /></span>
                                ) : (
                                  <span className="flex items-center gap-1">Read full proposal <ChevronDown className="h-3 w-3" /></span>
                                )}
                              </Button>
                            </div>

                            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                              <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-muted-foreground"><Wallet className="h-4 w-4" /> Rate:</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{app.proposedRate} ETH</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /> Duration:</span>
                                <span className="font-medium">{app.estimatedDuration.replace(/-/g, " ")}</span>
                              </div>
                            </div>
                          </div>

                          {expandedAppId === app.id && (
                            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid gap-4 animate-in fade-in slide-in-from-top-2">
                              <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Skills & Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                  {app.skills?.length ? app.skills.map(skill => (
                                    <Badge key={skill} variant="secondary" className="font-normal">{skill}</Badge>
                                  )) : <span className="text-sm italic text-muted-foreground">No skills listed</span>}
                                </div>
                              </div>
                              <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Experience</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{app.experience || 'No experience details provided.'}</p>
                              </div>
                            </div>
                          )}

                          {app.status === "PENDING" && (
                            <div className="mt-6 flex gap-3">
                              <Button
                                size="sm"
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                onClick={() => handleApplicationStatus(app.id, "ACCEPTED")}
                              >
                                Accept Application
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-900/20"
                                onClick={() => handleApplicationStatus(app.id, "REJECTED")}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </section>
            ))
          )}
        </div>
      </main>
    </div>
  )
}