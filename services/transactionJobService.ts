import axiosInstance from "@/lib/axiosInstance";

export function completedJob(jobId:number){
    return axiosInstance.post(`/blockchain/jobs/${jobId}/complete`)
}