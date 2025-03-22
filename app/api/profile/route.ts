import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, you would fetch the user profile from your NestJS backend
    // For now, we'll return a mock profile

    const profile = {
      name: "John Doe",
      email: "john@example.com",
      bio: "Experienced blockchain developer with a passion for decentralized applications.",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      skills: ["Solidity", "React", "Node.js", "Web3.js"],
      website: "https://johndoe.dev",
      github: "https://github.com/johndoe",
      twitter: "@johndoe",
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const profileData = await request.json()

    // In a real app, you would update the profile in your NestJS backend
    // For now, we'll simulate a successful update

    return NextResponse.json({
      ...profileData,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

