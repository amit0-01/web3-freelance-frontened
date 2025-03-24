// Mock data for development purposes
// In a real app, these would be API calls to your NestJS backend

import { cookies } from "next/headers"
import axiosInstance from "./axiosInstance"

interface Client {
  id: string
  name: string
  rating: number
  memberSince: string
  jobsPosted: number
}

export interface Job {
  id: string
  title: string
  description: string
  category: string
  budget: number
  duration: string
  skills: string[]
  isUrgent: boolean
  postedDate: string
  deadline: string
  status: string
  client: Client
  requirements: string[]
  responsibilities: string[]
  deliverables: string[]
  paymentType: string
}

const mockClients: Client[] = [
  {
    id: "client1",
    name: "Ethereum Foundation",
    rating: 4.9,
    memberSince: "Jan 2020",
    jobsPosted: 24,
  },
  {
    id: "client2",
    name: "DeFi Protocol",
    rating: 4.7,
    memberSince: "Mar 2021",
    jobsPosted: 12,
  },
  {
    id: "client3",
    name: "NFT Marketplace",
    rating: 4.5,
    memberSince: "Jun 2021",
    jobsPosted: 8,
  },
]

const mockJobs: Job[] = [
  {
    id: "job1",
    title: "Smart Contract Developer",
    description:
      "We're looking for an experienced Solidity developer to build and audit our DeFi protocol smart contracts.",
    category: "Development",
    budget: 3.5,
    duration: "2-4 weeks",
    skills: ["Solidity", "Ethereum", "Smart Contracts", "DeFi"],
    isUrgent: true,
    postedDate: "2 days ago",
    deadline: "2023-12-15",
    status: "Open",
    client: mockClients[0],
    requirements: [
      "3+ years of Solidity development experience",
      "Experience with DeFi protocols",
      "Understanding of security best practices",
      "Experience with testing frameworks",
    ],
    responsibilities: [
      "Develop smart contracts for our DeFi protocol",
      "Implement security measures and best practices",
      "Perform testing and debugging",
      "Document code and architecture",
    ],
    deliverables: [
      "Fully functional and tested smart contracts",
      "Technical documentation",
      "Deployment scripts",
      "Security audit report",
    ],
    paymentType: "Fixed Price",
  },
  {
    id: "job2",
    title: "Frontend Developer for Web3 App",
    description: "We need a frontend developer to build a user-friendly interface for our decentralized application.",
    category: "Development",
    budget: 2.8,
    duration: "1-3 months",
    skills: ["React", "Next.js", "Web3.js", "TypeScript"],
    isUrgent: false,
    postedDate: "5 days ago",
    deadline: "2023-12-20",
    status: "Open",
    client: mockClients[1],
    requirements: [
      "Experience with React and Next.js",
      "Familiarity with Web3 libraries",
      "Strong TypeScript skills",
      "Understanding of blockchain concepts",
    ],
    responsibilities: [
      "Build responsive UI components",
      "Integrate with blockchain via Web3.js",
      "Implement wallet connection",
      "Ensure cross-browser compatibility",
    ],
    deliverables: [
      "Complete frontend application",
      "Source code and documentation",
      "User guide",
      "Deployment instructions",
    ],
    paymentType: "Fixed Price",
  },
  {
    id: "job3",
    title: "Blockchain Security Auditor",
    description:
      "Conduct a comprehensive security audit of our smart contracts and provide recommendations for improvements.",
    category: "Security",
    budget: 5.0,
    duration: "1-2 weeks",
    skills: ["Security", "Solidity", "Auditing", "Blockchain"],
    isUrgent: true,
    postedDate: "1 week ago",
    deadline: "2023-12-10",
    status: "Open",
    client: mockClients[2],
    requirements: [
      "Proven experience in smart contract auditing",
      "Deep understanding of common vulnerabilities",
      "Experience with security tools",
      "Strong analytical skills",
    ],
    responsibilities: [
      "Review smart contract code",
      "Identify security vulnerabilities",
      "Provide detailed reports",
      "Suggest improvements",
    ],
    deliverables: [
      "Comprehensive audit report",
      "Vulnerability assessment",
      "Recommendations for fixes",
      "Follow-up review after fixes",
    ],
    paymentType: "Fixed Price",
  },
]

export async function getJobs(context: any, limit?: number) {
  try {
    // const { req } = context; // Get request object from context
    // const token = req.cookies["token"]; // Access token from cookies

    // if (!token) {
    //   throw new Error("No authentication token found.");
    // }

    const response = await axiosInstance.get("/blockchain/jobs");
    console.log('response',response);

    return response.data;
  } catch (error: any) {
    // console.log("❌ Error fetching jobs:", error.response?.data || error.message);
    // if (error.response?.status === 401) {
    //   throw new Error("Unauthorized: Please log in again.");
    // }
    // throw error;
  }
}

export async function getJobDetail(id: string): Promise<Job> {
  const response = await axiosInstance.get(`/blockchain/jobs/${id}`);

  if (!response.data) {
    throw new Error("Job not found");
  }

  return response.data; 
}


export async function completeJob(jobId: string): Promise<{ success: boolean }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, this would update the job status in the database
  return { success: true }
}

export async function releasePayment(jobId: string): Promise<{ success: boolean }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, this would trigger a blockchain transaction
  return { success: true }
}

