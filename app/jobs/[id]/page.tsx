import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardNav from "@/components/dashboard-nav"
import { getJobDetail } from "@/lib/api"

interface JobDetailPageProps {
  params: {
    id: string
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  try {
    const id = await params?.id
    if (!id) {
      return <div>Error: Job ID is missing</div>
    }
    
    const job = await getJobDetail(id)
    
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-10">
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <Link href="/jobs" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
                  ← Back to Jobs
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge>{job.category}</Badge>
                  <Badge variant="outline">{job.paymentType}</Badge>
                  <Badge variant="secondary">{job.status}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Share</Button>
                <Button>Apply Now</Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-6 md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none dark:prose-invert">
                      <p>{job.description}</p>

                      <h3>Requirements</h3>
                      <ul>
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>

                      <h3>Responsibilities</h3>
                      <ul>
                        {job.responsibilities.map((resp, index) => (
                          <li key={index}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Deliverables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.deliverables.map((deliverable, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="font-medium">{job.budget} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{job.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Posted:</span>
                      <span className="font-medium">{job.postedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span className="font-medium">{job.deadline}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Apply for this Job</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>About the Client</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div>
                        <div className="font-medium">{job.client.name}</div>
                        <div className="text-sm text-muted-foreground">Member since {job.client.memberSince}</div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jobs Posted:</span>
                      <span className="font-medium">{job.client.jobsPosted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-medium">{job.client.rating}/5</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error: any) {
    return <div>Error: {error.message || 'Failed to load job details'}</div>
  }
}

