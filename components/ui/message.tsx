"use client"

import { MessageProps } from "@/lib/chat.interface";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { FileIcon, Download, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

export function Message({ message, isOwn }: MessageProps) {
  const [imageError, setImageError] = useState(false);
  const isImage = message.attachment?.type?.startsWith("image/");
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-lg px-3 py-1.5 md:px-4 md:py-2",
          isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {message.attachment && (
          <div className={cn("mb-1.5 md:mb-2", isImage ? "" : "rounded bg-background/50 p-1.5 md:p-2")}>
            {isImage && !imageError ? (
              <div className="relative rounded-lg overflow-hidden max-w-full">
                <img
                  src={message.attachment.url}
                  alt={message.attachment.name}
                  className="max-w-full h-auto max-h-64 md:max-h-96 rounded-lg object-contain cursor-pointer"
                  onError={() => setImageError(true)}
                  onClick={() => window.open(message.attachment.url, "_blank")}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 flex items-center justify-between">
                  <span className="truncate flex-1">{message.attachment.name}</span>
                  <a
                    href={message.attachment.url}
                    download={message.attachment.name}
                    className="ml-2 hover:text-primary-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 md:gap-2">
                <FileIcon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs md:text-sm truncate font-medium">{message.attachment.name}</span>
                    <a
                      href={message.attachment.url}
                      download={message.attachment.name}
                      className="flex-shrink-0 hover:opacity-80 transition-opacity"
                      title="Download file"
                    >
                      <Download className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </a>
                  </div>
                  <span className="text-[10px] md:text-xs opacity-70">
                    {formatFileSize(message.attachment.size)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        {message.content && (
          <p className="break-words text-sm md:text-base">{message.content}</p>
        )}
        <div className={cn("text-[10px] md:text-xs mt-0.5 md:mt-1", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
}
  