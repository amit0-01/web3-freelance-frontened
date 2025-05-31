"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DashboardNav from "@/components/dashboard-nav"
import ChatSidebar from "@/components/chat/chat-sidebar"
import ChatWindow from "@/components/chat/chat-window"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConversation, setActiveConversation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const conversationId = searchParams.get("id")
  const { toast } = useToast()

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/conversations")
        console.log('response', response)
        if (!response.ok) {
          throw new Error("Failed to fetch conversations")
        }
        const data = await response.json()
        console.log('data',data)
        setConversations(data)

        // If there's a conversation ID in the URL, set it as active
        if (conversationId) {
          const conversation = data.find((conv: any) => conv.id === conversationId)
          if (conversation) {
            setActiveConversation(conversation)
          } else if (data.length > 0) {
            setActiveConversation(data[0])
          }
        } else if (data.length > 0) {
          setActiveConversation(data[0])
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
  }, [conversationId, toast])

  const handleSelectConversation = (conversation: any) => {
    setActiveConversation(conversation)
    // Update URL without full page reload
    router.push(`/messages?id=${conversation.id}`, { scroll: false })

    // Mark conversation as read
    if (conversation.unreadCount > 0) {
      markConversationAsRead(conversation.id)
    }
  }

  const markConversationAsRead = async (id: string) => {
    try {
      await fetch(`/api/conversations/${id}/read`, {
        method: "POST",
      })

      // Update local state
      setConversations((prevConversations) =>
        prevConversations.map((conv) => (conv.id === id ? { ...conv, unreadCount: 0 } : conv)),
      )
    } catch (error) {
      console.error("Failed to mark conversation as read:", error)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!activeConversation || !content.trim()) return

    try {
      const response = await fetch(`/api/conversations/${activeConversation.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const newMessage = await response.json()

      // Update the active conversation with the new message
      setActiveConversation((prev: any) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessage: newMessage,
        updatedAt: new Date().toISOString(),
      }))

      // Update the conversations list to show the latest message
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === activeConversation.id
            ? {
                ...conv,
                lastMessage: newMessage,
                updatedAt: new Date().toISOString(),
              }
            : conv,
        ),
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardNav />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav />
      <main className="flex-1 flex">
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversation?.id}
          onSelectConversation={handleSelectConversation}
        />
        {activeConversation ? (
          <ChatWindow conversation={activeConversation} onSendMessage={handleSendMessage} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <h3 className="text-lg font-medium">No conversations yet</h3>
              <p className="text-muted-foreground">
                When you apply for jobs or hire freelancers, your conversations will appear here.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
