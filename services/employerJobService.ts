import axiosInstance from "@/lib/axiosInstance"

export async function changeApplicationStatus(
  jobId: number,
  status: string,
) {
  return await axiosInstance.post(`blockchain/${jobId}/status`,{ status })
}