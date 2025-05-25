import axiosInstance from "@/lib/axiosInstance"

export async function fetchActiveJobsCount(role: string) {
    return await axiosInstance.get(`/blockchain/active-jobs?role=${role}`)
  }
  
    