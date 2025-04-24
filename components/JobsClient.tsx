// components/JobsClient.tsx (Client Component)
"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { getUserRole } from "@/lib/utils";

interface Job {
  id: number;
  title: string;
  description: string;
  payment: string;
  category: string;
}



export default function JobsClient({ jobs, role }: { jobs: Job[], role: string }) {
  console.log('role', role);
  if (!jobs.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No jobs found</p>
      </div>
    );
  }




  return (
    <div className="grid gap-6 md:grid-cols-2">
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>{role == 'ADMIN' ? 'My Jobs' : 'Recent Jobs'}</CardTitle>
        <CardDescription>Recently posted jobs that match your skills</CardDescription>
      </CardHeader>
      <CardContent>
      <div className="md:col-span-3">
    <div className="space-y-4">
    {jobs.map((job) => (
   <Card key={job.id}>
   <CardContent className="p-6">
     <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
       <div className="space-y-2">
         <h3 className="font-semibold text-lg">
           <Link href={`/jobs/${job.id}`} className="hover:underline">
             {job.title}
           </Link>
         </h3>
         <p className="text-sm text-muted-foreground">
          {job.description}</p>
         <Badge variant="outline">{job.category}</Badge>
       </div>
       <div className="flex flex-col items-end gap-2">
         <div className="text-right">
           <div className="font-bold">{job.payment} ETH</div>
         </div>
       </div>
     </div>
   </CardContent>
   <CardFooter className="px-6 py-4 bg-muted/50 flex justify-between">
     <Link href={`/jobs/${job.id}`}>
       <Button size="sm">View Details</Button>
     </Link>
   </CardFooter>
 </Card>
 
   
    ))}
  </div>

  </div>
        </CardContent>
        <CardFooter>
          <Link href="/jobs">
            <Button variant="outline">View All Jobs</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
