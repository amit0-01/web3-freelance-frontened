// components/JobsClient.tsx (Client Component)
"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Job {
  id: number;
  title: string;
  description: string;
  payment: string;
  category: string;
}



export default function JobsClient({ jobs }: { jobs: Job[] }) {
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
  );
}
