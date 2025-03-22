import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, password, walletAddress } = await request.json()

    // In a real app, you would send this data to your NestJS backend
    // For now, we'll simulate a successful registration

    // Validate input
    if (!name || !email || !password || !walletAddress) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Mock successful registration
    return NextResponse.json({
      success: true,
      message: "User registered successfully",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

