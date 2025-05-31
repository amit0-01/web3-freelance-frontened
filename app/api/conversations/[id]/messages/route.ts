import { NextResponse } from "next/server"

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = params
    const { content, attachment } = await request.json()

    // In a real app, you would call your NestJS backend to create a new message
    // For now, we'll simulate a successful message creation

    // Validate input
    if (!content && !attachment) {
      return NextResponse.json({ error: "Message content or attachment is required" }, { status: 400 })
    }

    // Mock successful message creation
    const newMessage = {
      id: `msg-${Date.now()}`,
      content,
      senderId: "current-user", // In a real app, this would be the authenticated user's ID
      createdAt: new Date().toISOString(),
      attachment,
    }

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
