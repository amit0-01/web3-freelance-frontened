import { NextResponse } from "next/server"

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = params

    // In a real app, you would call your NestJS backend to mark the job as complete
    // For now, we'll simulate a successful completion

    return NextResponse.json({
      success: true,
      jobId: id,
      status: "Completed",
      completedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error completing job:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

