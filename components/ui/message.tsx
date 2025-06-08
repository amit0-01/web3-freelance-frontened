import { MessageProps } from "@/lib/chat.interface";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { FileIcon } from "lucide-react";

export function Message({ message, isOwn }: MessageProps) {
    return (
      <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
        <div
          className={cn("max-w-[75%] rounded-lg px-4 py-2", isOwn ? "bg-primary text-primary-foreground" : "bg-muted")}
        >
          {message.attachment && (
            <div className="mb-2 flex items-center gap-2 rounded bg-background/50 p-2">
              <FileIcon className="h-4 w-4" />
              <span className="text-sm truncate">{message.attachment.name}</span>
            </div>
          )}
          <p className="break-words">{message.content}</p>
          <div className={cn("text-xs mt-1", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>
    )
  }
  