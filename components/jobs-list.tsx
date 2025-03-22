// components/JobsList.tsx (Server Component)
import JobsClient from "./JobsClient"
import { getJobs } from "@/lib/api";

interface JobsListProps {
  limit?: number;
}

export default async function JobsList({ limit }: JobsListProps) {
  const jobs = await getJobs(limit); // Fetch on the server
  return <JobsClient jobs={jobs} />;
}
