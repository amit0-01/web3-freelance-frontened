"use client";
import { useEffect, useState } from "react";
import JobsClient from "./JobsClient";
import { getJobs } from "@/lib/api";

interface JobsListProps {
  limit?: number;
}

export default function JobsList({ limit }: JobsListProps) {
  const [jobs, setJobs] = useState<any[]>([]); // Initialized state properly

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs(limit);
        setJobs(response);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchJobs();
  }, [limit]); // Added 'limit' as a dependency

  return <JobsClient jobs={jobs} />;
}
