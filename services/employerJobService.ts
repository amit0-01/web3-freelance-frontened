import axiosInstance from "@/lib/axiosInstance"

export async function changeApplicationStatus(
  jobId: number,
  status: string,
) {
  return await axiosInstance.patch(`blockchain/${jobId}/status`,{ status })
}