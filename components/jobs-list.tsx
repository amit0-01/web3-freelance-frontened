"use client";
import { useEffect, useState } from "react";
import JobsClient from "./JobsClient";
import { getJobs } from "@/lib/api";
import { JobsListSkeleton } from "./skeleton";
import { getUserRole } from "@/lib/utils";

interface JobsListProps {
  search?: string
}


export default function JobsList({ search }: JobsListProps) {
  const [jobs, setJobs] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('');

  // FETCH JOBS
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


  useEffect(() => {
    const role = getUserRole();
    console.log('role', role);
    setRole(role);
  }, []);

  useEffect(() => {
    fetchJobs()
  }, [search])
  if (loading) return <JobsListSkeleton />
  return <JobsClient jobs={jobs} role={role} />;
}
