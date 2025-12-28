import axiosInstance from "./axiosInstance"

export interface Payment {
  id: string
  job: {
    id: string
    title: string
  }
  type: "incoming" | "outgoing"
  amount: number
  status: "pending" | "ready_to_release" | "released" | "completed" | "disputed"
  transactionHash?: string
  createdAt: string
  freelancer?: {
    name: string
  }
}

// Mock function - replace with actual API call
export async function getPayments(status: string) {
    try {
      const response = await axiosInstance.get(`blockchain/payments?status=${status}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  }
  

// Updated release payment function to accept payment method
export async function releasePayment(
  jobId: string,
  paymentMethod: "blockchain" | "paypal" = "blockchain",
  paymentId : string
) {
  if (paymentMethod === "blockchain") {
    return releaseBlockchainPayment(jobId);
  } else {
    return releasePaymentGateway(jobId, paymentId);
  }
}

async function releaseBlockchainPayment(jobId: string) {
  try {
    const response = await axiosInstance.post(
      `blockchain/jobs/${jobId}/release-payment`,
      {
        method: "blockchain",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error releasing blockchain payment:", error);
    throw error;
  }
}

async function releasePaymentGateway(jobId: string, paymentId : string) {
  try {
    const response = await axiosInstance.post(
      `blockchain/jobs/${jobId}/release-payment`,
      {
        method: "gateway",
        paymentId : paymentId
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error releasing PayPal payment:", error);
    throw error;
  }
}

  

// Mock function - replace with actual API call
export async function fetchPayments() {
    try {
      const response = await axiosInstance.get(`blockchain/payments`);
      return response.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  }
  
