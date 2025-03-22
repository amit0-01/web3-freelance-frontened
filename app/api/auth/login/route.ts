import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // In a real app, you would validate credentials against your NestJS backend
    // For now, we'll simulate a successful login with a mock token

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Mock successful login
    return NextResponse.json({
      token: "mock_jwt_token",
      user: {
        id: "user1",
        name: "John Doe", 
        email: email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

