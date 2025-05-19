import axiosInstance from "@/lib/axiosInstance";

export const getJobReadyToRelease = async () => {
  return await axiosInstance.get(`/blockchain/jobs/ready-to-release`);
}

export const releasePayment = async (jobId: number) => {
  return await axiosInstance.post(`/blockchain/jobs/${jobId}/release-payment`);
}