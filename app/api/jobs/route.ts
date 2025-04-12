import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // In a real app, you would fetch jobs from your NestJS backend
    // For now, we'll return a mock response

    // Parse query parameters
    const url = new URL(request.url)
    const limit = url.searchParams.get("limit")

    // Mock jobs data
    const jobs = [
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
        status: "Open",
      },
      {
        id: "job2",
        title: "Frontend Developer for Web3 App",
        description:
          "We need a frontend developer to build a user-friendly interface for our decentralized application.",
        category: "Development",
        budget: 2.8,
        duration: "1-3 months",
        skills: ["React", "Next.js", "Web3.js", "TypeScript"],
        isUrgent: false,
        postedDate: "5 days ago",
        status: "Open",
      },
    ]

    // Apply limit if provided
    const limitedJobs = limit ? jobs.slice(0, Number.parseInt(limit)) : jobs

    return NextResponse.json(limitedJobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const jobData = await request.json()

    // In a real app, you would send this data to your NestJS backend
    // For now, we'll simulate a successful job creation

    // Validate input
    if (!jobData.title || !jobData.description || !jobData.budget) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Mock successful job creation
    return NextResponse.json({
      id: "new-job-id",
      ...jobData,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

