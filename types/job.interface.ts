import { Job } from "@/lib/api"

export interface ApplyJobModalProps {
  job: Job
  isOpen: boolean
  onClose: () => void
}

export interface JobsListProps {
  search?: string
  category? : string
}

export interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  coverLetter: string
  proposedRate: number
  estimatedDuration: string
  status: string
  submittedAt: string
}
