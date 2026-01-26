export interface Application {
  id: string
  coverLetter: string
  proposedRate: number
  estimatedDuration: string
  status: string
  createdAt: string
  skills?: string[]
  experience?: string
  user: {
    id: number
    name: string
    email: string
  }
}

export interface JobWithApplications {
  id: number
  title: string
  description: string
  applications: Application[]
}
