"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ConversationItem } from "../ui/conversationItem"
import { ChatSidebarProps } from "@/lib/chat.interface"
import socket from "@/services/socket"


export default function ChatSidebar({ conversations, activeConversationId, onSelectConversation }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [onlineStatusMap, setOnlineStatusMap] = useState<Record<string, 'online' | 'offline'>>({})


  const filteredConversations = conversations.filter((conversation) =>
    conversation.participant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort conversations by updatedAt (most recent first)
  const sortedConversations = [...filteredConversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  useEffect(() => {
    // Connect socket
    if (!socket.connected) {
      socket.connect()
    }

    // Emit status check for all participants
    conversations.forEach((conversation) => {
      socket.emit("getOnlineStatus", { userId: conversation.participant.id })
    })

    // Listen for individual status updates
    const handleStatus = ({ userId, status }: { userId: string; status: 'online' | 'offline' }) => {
      setOnlineStatusMap((prev) => ({ ...prev, [userId]: status }))
    }

    socket.on("onlineStatus", handleStatus)

    return () => {
      socket.off("onlineStatus", handleStatus)
    }
  }, [])
  

  return (
    <div className="w-full md:w-80 border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sortedConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No conversations found</div>
        ) : (
          <div className="py-2">
            {sortedConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                isOnline={onlineStatusMap[conversation.participant.id] === "online"}
                onClick={() => onSelectConversation(conversation)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}