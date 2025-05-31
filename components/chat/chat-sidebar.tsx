"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  conversations: any[]
  activeConversationId: string | null
  onSelectConversation: (conversation: any) => void
}

export default function ChatSidebar({ conversations, activeConversationId, onSelectConversation }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conversation) =>
    conversation.participant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort conversations by updatedAt (most recent first)
  const sortedConversations = [...filteredConversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  return (
    <div className="w-full md:w-80 border-r flex flex-col">
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
      <ScrollArea className="flex-1">
        {sortedConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No conversations found</div>
        ) : (
          <div className="py-2">
            {sortedConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onClick={() => onSelectConversation(conversation)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

interface ConversationItemProps {
  conversation: any
  isActive: boolean
  onClick: () => void
}

function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const { participant, lastMessage, updatedAt, unreadCount, jobTitle } = conversation

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors",
        isActive && "bg-muted",
      )}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        {participant.avatar ? (
          <img
            src={participant.avatar || "/placeholder.svg"}
            alt={participant.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-medium text-primary">{participant.name.charAt(0)}</span>
          </div>
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
            {unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h4 className="font-medium truncate">{participant.name}</h4>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatDistanceToNow(new Date(updatedAt), { addSuffix: false })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{lastMessage?.content || "No messages yet"}</p>
        <p className="text-xs text-muted-foreground mt-1 truncate">{jobTitle}</p>
      </div>
    </div>
  )
}
