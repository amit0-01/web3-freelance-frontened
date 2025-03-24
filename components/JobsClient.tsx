// components/JobsClient.tsx (Client Component)
"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Job {
  id: number;
  title: string;
  isUrgent?: boolean;
  payment: string;
}

export default function JobsClient({ jobs }: { jobs: Job[] }) {
  console.log('jobs',jobs)
  if (!jobs.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No jobs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    <Link href={`/jobs/${job.id}`} className="hover:underline">
                      {job.title}
                    </Link>
                  </h3>
                  <Badge variant="outline">{job.title}</Badge>
                  {job.isUrgent && <Badge variant="destructive">Urgent</Badge>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <div className="font-bold">{job.payment} ETH</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-6 py-4 bg-muted/50 flex flex-wrap justify-between gap-2">
            <Link href={`/jobs/${job.id}`}>
              <Button size="sm">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
