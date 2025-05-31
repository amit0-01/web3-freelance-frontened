"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { Send, FileIcon, Paperclip, MoreVertical, ExternalLink } from "lucide-react"
import { cn, getUserDetails } from "@/lib/utils"
import Link from "next/link"
import socket, { joinRoom, offReceiveMessage, onReceiveMessage, sendMessage } from "@/services/socket"

interface ChatWindowProps {
  conversation: any
  onSendMessage: (content: string) => void
}

export default function ChatWindow({ conversation, onSendMessage }: ChatWindowProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { participant, messages, jobId, jobTitle } = conversation

  // console.log('getUserDetails', getUserDetails())


  useEffect(() => {
    // Listen to incoming messages
    socket.on('receiveMessage', (message) => {
      console.log('message', message)
      console.log('conversation', conversation)
      // setMessages((prev) => [...prev, message]);
    });

    // Typing indicator
    socket.on('typing', (userId) => {
      console.log('userid', userId);
      // setTypingUser(userId);
      // setTimeout(() => setTypingUser(null), 3000);
    });

    // User connected
    socket.on('userConnected', (user) => {
      console.log('User connected:', user);
    });

    // User disconnected
    socket.on('userDisconnected', (userId) => {
      console.log('User disconnected:', userId);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('userConnected');
      socket.off('userDisconnected');
    };
  }, []);

  useEffect(() => {
    if (conversation?.jobId) {
      joinRoom(conversation.jobId);
    }
  
    onReceiveMessage((data) => {
      // console.log('receinvemessage', data);
      // console.log("conversation:", conversation);
      // Optionally update local state here
    });
  
    return () => {
      offReceiveMessage();
    };
  }, [conversation?.jobId]);

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;
  
    setIsSubmitting(true);
    try {
      sendMessage(conversation.jobId, getUserDetails().id, message);
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
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
          <div>
            <h3 className="font-medium">{participant.name}</h3>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Link href={`/jobs/${jobId}`} className="hover:underline flex items-center">
                {jobTitle} <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg: any) => <Message key={msg.id} message={msg} isOwn={msg.senderId !== participant.id} />)
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!message.trim() || isSubmitting} className="flex-shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}

interface MessageProps {
  message: any
  isOwn: boolean
}

function Message({ message, isOwn }: MessageProps) {
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
