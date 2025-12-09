import { MessageProps } from "@/lib/chat.interface";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { FileIcon } from "lucide-react";

export function Message({ message, isOwn }: MessageProps) {
    return (
      <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
        <div
          className={cn(
            "max-w-[85%] md:max-w-[75%] rounded-lg px-3 py-1.5 md:px-4 md:py-2",
            isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {message.attachment && (
            <div className="mb-1.5 md:mb-2 flex items-center gap-1.5 md:gap-2 rounded bg-background/50 p-1.5 md:p-2">
              <FileIcon className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
              <span className="text-xs md:text-sm truncate">{message.attachment.name}</span>
            </div>
          )}
          <p className="break-words text-sm md:text-base">{message.content}</p>
          <div className={cn("text-[10px] md:text-xs mt-0.5 md:mt-1", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>
    )
  }
  