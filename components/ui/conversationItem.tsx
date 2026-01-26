import { ConversationItemProps } from "@/types/chat.interface"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  isOnline,
}: ConversationItemProps) {
  const { participant, lastMessage, updatedAt, unreadCount, jobTitle } = conversation

  return (
    <div
      className={cn(
        "flex items-start gap-2 md:gap-3 p-2.5 md:p-3 cursor-pointer hover:bg-muted/50 transition-colors",
        isActive && "bg-muted",
      )}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        {participant.avatar ? (
          <img
            src={participant.avatar || "/placeholder.svg"}
            alt={participant.name}
            className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-medium text-primary text-sm md:text-base">
              {participant.name.charAt(0)}
            </span>
          </div>
        )}

        {/* 🔵 Online status dot */}
        <span
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 md:h-3 md:w-3 rounded-full border-2",
            isOnline ? "bg-green-500 border-white" : "bg-gray-400 border-white",
          )}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full bg-primary text-[9px] md:text-[10px] font-medium flex items-center justify-center text-primary-foreground">
            {unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-2">
          <h4 className="font-medium truncate text-sm md:text-base">{participant.name}</h4>
          <span className="text-[10px] md:text-xs text-muted-foreground flex-shrink-0">
            {formatDistanceToNow(new Date(updatedAt), { addSuffix: false })}
          </span>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground truncate mt-0.5">
          {lastMessage?.content || "No messages yet"}
        </p>
        <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 truncate">{jobTitle}</p>
      </div>
    </div>
  )
}
