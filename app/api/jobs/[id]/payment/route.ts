import { NextResponse } from "next/server"
import { RouteParams } from "@/types/chat.interface"

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = params

    // In a real app, you would call your NestJS backend to release payment
    // For now, we'll simulate a successful payment release

    return NextResponse.json({
      success: true,
      jobId: id,
      paymentStatus: "Released",
      transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      releasedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error releasing payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

