import axiosInstance from "@/lib/axiosInstance";

export const getPayments = async (status?: string) => {
  const params = status && status !== 'all' ? { status } : {};
  return await axiosInstance.get(`/blockchain/payments`, { params });
};


export const releasePayment = async (jobId: number) => {
  return await axiosInstance.post(`/blockchain/jobs/${jobId}/release-payment`);
}