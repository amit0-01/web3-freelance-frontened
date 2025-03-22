import { NextResponse } from "next/server"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params

    // In a real app, you would fetch job details from your NestJS backend
    // For now, we'll return a mock response

    // Mock job data
    const job = {
      id,
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
      client: {
        id: "client1",
        name: "Ethereum Foundation",
        rating: 4.9,
        memberSince: "Jan 2020",
        jobsPosted: 24,
      },
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
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Error fetching job details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = params
    const jobData = await request.json()

    // In a real app, you would update the job in your NestJS backend
    // For now, we'll simulate a successful update

    return NextResponse.json({
      id,
      ...jobData,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

