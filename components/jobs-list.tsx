"use client";
import { useEffect, useState } from "react";
import JobsClient from "./JobsClient";
import { getAdminPostedJobs, getJobs } from "@/lib/api";
import { JobsListSkeleton } from "./skeleton";
import { getUserRole } from "@/lib/utils";

interface JobsListProps {
  search?: string
  category? : string
}


export default function JobsList({ search, category }: JobsListProps) {
  const [jobs, setJobs] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('');

  const userRole = getUserRole();
  // FETCH JOBS
  const fetchJobs = async () => {
    setLoading(true)
    try {
      if(userRole=='FREELANCER'){
      const response = await getJobs(search, category)
      setJobs(response)
      } else if(userRole == 'ADMIN'){
        const response = await getAdminPostedJobs(search)
        setJobs(response)
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    const role = getUserRole();
    setRole(role);
  }, []);

  useEffect(() => {
    fetchJobs()
  }, [search, category])
  if (loading) return <JobsListSkeleton />
  return <JobsClient jobs={jobs} role={role} />;
}
