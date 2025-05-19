// Mock data for development purposes
// In a real app, these would be API calls to your NestJS backend

import { cookies } from "next/headers"
import axiosInstance from "./axiosInstance"
import axios from 'axios';

interface Client {
  id: string
  name: string
  rating: number
  memberSince: string
  jobsPosted: number
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string[];
  payment: string;
  employer: string;
  freelancer: string;
  isCompleted: boolean;
  deliverables: string[];
  duration : string;
  postedDate: string;
  deadline : string
  paymentType: string;
  status: string
}

export interface Payment {
  id: number;
  title: string;
  description: string;
  payment: number;
  createdAt: string; // ISO date string
  transactionHash?: string;
  type: 'incoming' | 'outgoing';
  status: 'pending' | 'completed';
  job: {
    id: number;
    title?: string;
  };
  freelancer: {
    id: number;
    name: string;
  };
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

// const mockJobs: Job[] = [
//   {
//     id: "job1",
//     title: "Smart Contract Developer",
//     description:
//       "We're looking for an experienced Solidity developer to build and audit our DeFi protocol smart contracts.",
//     category: "Development",
//     budget: 3.5,
//     duration: "2-4 weeks",
//     skills: ["Solidity", "Ethereum", "Smart Contracts", "DeFi"],
//     isUrgent: true,
//     postedDate: "2 days ago",
//     deadline: "2023-12-15",
//     status: "Open",
//     client: mockClients[0],
//     requirements: [
//       "3+ years of Solidity development experience",
//       "Experience with DeFi protocols",
//       "Understanding of security best practices",
//       "Experience with testing frameworks",
//     ],
//     responsibilities: [
//       "Develop smart contracts for our DeFi protocol",
//       "Implement security measures and best practices",
//       "Perform testing and debugging",
//       "Document code and architecture",
//     ],
//     deliverables: [
//       "Fully functional and tested smart contracts",
//       "Technical documentation",
//       "Deployment scripts",
//       "Security audit report",
//     ],
//     paymentType: "Fixed Price",
//   },
//   {
//     id: "job2",
//     title: "Frontend Developer for Web3 App",
//     description: "We need a frontend developer to build a user-friendly interface for our decentralized application.",
//     category: "Development",
//     budget: 2.8,
//     duration: "1-3 months",
//     skills: ["React", "Next.js", "Web3.js", "TypeScript"],
//     isUrgent: false,
//     postedDate: "5 days ago",
//     deadline: "2023-12-20",
//     status: "Open",
//     client: mockClients[1],
//     requirements: [
//       "Experience with React and Next.js",
//       "Familiarity with Web3 libraries",
//       "Strong TypeScript skills",
//       "Understanding of blockchain concepts",
//     ],
//     responsibilities: [
//       "Build responsive UI components",
//       "Integrate with blockchain via Web3.js",
//       "Implement wallet connection",
//       "Ensure cross-browser compatibility",
//     ],
//     deliverables: [
//       "Complete frontend application",
//       "Source code and documentation",
//       "User guide",
//       "Deployment instructions",
//     ],
//     paymentType: "Fixed Price",
//   },
//   {
//     id: "job3",
//     title: "Blockchain Security Auditor",
//     description:
//       "Conduct a comprehensive security audit of our smart contracts and provide recommendations for improvements.",
//     category: "Security",
//     budget: 5.0,
//     duration: "1-2 weeks",
//     skills: ["Security", "Solidity", "Auditing", "Blockchain"],
//     isUrgent: true,
//     postedDate: "1 week ago",
//     deadline: "2023-12-10",
//     status: "Open",
//     client: mockClients[2],
//     requirements: [
//       "Proven experience in smart contract auditing",
//       "Deep understanding of common vulnerabilities",
//       "Experience with security tools",
//       "Strong analytical skills",
//     ],
//     responsibilities: [
//       "Review smart contract code",
//       "Identify security vulnerabilities",
//       "Provide detailed reports",
//       "Suggest improvements",
//     ],
//     deliverables: [
//       "Comprehensive audit report",
//       "Vulnerability assessment",
//       "Recommendations for fixes",
//       "Follow-up review after fixes",
//     ],
//     paymentType: "Fixed Price",
//   },
// ]


export async function getJobs(search?: string, category?: string) {
  try {
    const params = new URLSearchParams();

    if (search) {
      params.append("search", search);
    }

    if (category && category.toLowerCase() !== "all") {
      params.append("category", category);
    }

    const url = `/blockchain/jobs?${params.toString()}`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
}


export async function getJobDetail(id: string){
  try {
    const response = await axiosInstance.get(`/blockchain/jobs/${id}`)
    return response.data;
  } catch (error) {
    throw error
  }
}


export async function getAdminPostedJobs(search? : string){
  try {
    const url = search
      ? `/blockchain/jobs/user-jobs?search=${encodeURIComponent(search)}`
      : "/blockchain/jobs/user-jobs"

    const response = await axiosInstance.get(url)
    return response.data
  } catch (error: any) {
    console.error("Error fetching jobs:", error)
    throw error
  }
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

