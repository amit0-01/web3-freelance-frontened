import { RouteParams } from "@/types/chat.interface"
import { NextResponse } from "next/server"


export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = params

    // In a real app, you would call your NestJS backend to mark the conversation as read
    // For now, we'll simulate a successful update

    return NextResponse.json({
      id,
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error marking conversation as read:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
