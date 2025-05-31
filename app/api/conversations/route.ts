import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real app, you would fetch conversations from your NestJS backend
    // For now, we'll return mock data

    // Mock conversations data
    const conversations = [
      {
        id: "conv1",
        participant: {
          id: "user1",
          name: "Alex Johnson",
          avatar: null,
        },
        jobId: "job1",
        jobTitle: "Smart Contract Developer",
        lastMessage: {
          id: "msg5",
          content: "I'll send you the updated code by tomorrow morning.",
          senderId: "user1",
          createdAt: "2023-11-28T15:30:00Z",
        },
        unreadCount: 2,
        updatedAt: "2023-11-28T15:30:00Z",
        messages: [
          {
            id: "msg1",
            content: "Hi, I'm interested in discussing the details of the smart contract project.",
            senderId: "user1",
            createdAt: "2023-11-28T10:00:00Z",
          },
          {
            id: "msg2",
            content: "Hello Alex! Thanks for reaching out. What specific experience do you have with DeFi protocols?",
            senderId: "current-user",
            createdAt: "2023-11-28T10:15:00Z",
          },
          {
            id: "msg3",
            content:
              "I've worked on several DeFi projects including lending protocols and AMMs. I've also conducted security audits for smart contracts.",
            senderId: "user1",
            createdAt: "2023-11-28T10:30:00Z",
          },
          {
            id: "msg4",
            content: "That sounds great! Could you share some examples of your previous work or GitHub repositories?",
            senderId: "current-user",
            createdAt: "2023-11-28T10:45:00Z",
          },
          {
            id: "msg5",
            content: "I'll send you the updated code by tomorrow morning.",
            senderId: "user1",
            createdAt: "2023-11-28T15:30:00Z",
          },
        ],
      },
      {
        id: "conv2",
        participant: {
          id: "user2",
          name: "Sarah Chen",
          avatar: null,
        },
        jobId: "job2",
        jobTitle: "Frontend Developer for Web3 App",
        lastMessage: {
          id: "msg3",
          content: "I've attached my portfolio with examples of React and Web3 projects.",
          senderId: "user2",
          createdAt: "2023-11-27T14:30:00Z",
          attachment: {
            name: "portfolio.pdf",
            url: "#",
          },
        },
        unreadCount: 0,
        updatedAt: "2023-11-27T14:30:00Z",
        messages: [
          {
            id: "msg1",
            content: "Hello, I saw your job posting for a Frontend Developer and I'd like to apply.",
            senderId: "user2",
            createdAt: "2023-11-27T13:00:00Z",
          },
          {
            id: "msg2",
            content: "Hi Sarah, thanks for your interest! Do you have experience with Web3 libraries?",
            senderId: "current-user",
            createdAt: "2023-11-27T13:15:00Z",
          },
          {
            id: "msg3",
            content: "I've attached my portfolio with examples of React and Web3 projects.",
            senderId: "user2",
            createdAt: "2023-11-27T14:30:00Z",
            attachment: {
              name: "portfolio.pdf",
              url: "#",
            },
          },
        ],
      },
      {
        id: "conv3",
        participant: {
          id: "user3",
          name: "Michael Rodriguez",
          avatar: null,
        },
        jobId: "job3",
        jobTitle: "Blockchain Security Auditor",
        lastMessage: {
          id: "msg2",
          content: "When would be a good time to discuss the security audit requirements in more detail?",
          senderId: "current-user",
          createdAt: "2023-11-26T16:45:00Z",
        },
        unreadCount: 0,
        updatedAt: "2023-11-26T16:45:00Z",
        messages: [
          {
            id: "msg1",
            content:
              "I'm interested in your security audit job. I have experience auditing smart contracts for vulnerabilities.",
            senderId: "user3",
            createdAt: "2023-11-26T16:30:00Z",
          },
          {
            id: "msg2",
            content: "When would be a good time to discuss the security audit requirements in more detail?",
            senderId: "current-user",
            createdAt: "2023-11-26T16:45:00Z",
          },
        ],
      },
    ]

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
