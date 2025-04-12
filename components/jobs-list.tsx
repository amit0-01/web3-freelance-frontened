"use client";
import { useEffect, useState } from "react";
import JobsClient from "./JobsClient";
import { getJobs } from "@/lib/api";
import { JobsListSkeleton } from "./skeleton";

interface JobsListProps {
  search: string
}


export default function JobsList({ search }: JobsListProps) {
  const [jobs, setJobs] = useState<any[]>([]); // Initialized state properly
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const response = await getJobs(search)
        setJobs(response)
      } catch (error) {
        console.error("Failed to fetch jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [search])
  if (loading) return <JobsListSkeleton />
  return <JobsClient jobs={jobs} />;
}
