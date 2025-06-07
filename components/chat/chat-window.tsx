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
  const { participant, jobIds, jobTitle } = conversation
  const [messages, setMessages] = useState<{ id: string; senderId: string; content: string; createdAt: string; attachment?: { name: string } }[]>(conversation.messages || []);


  // console.log('getUserDetails', getUserDetails())


  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    const handleReceiveMessage = (message:any) => {
      console.log("📩 Received message:", message);
      setMessages((prev) => [...prev, message]);
    };
  
    const handleTyping = (userId: string) => {
      console.log("✍️ Typing userId:", userId);
    };
  
    const handleUserConnected = (user: any) => {
      console.log("🔌 User connected:", user);
    };
  
    const handleUserDisconnected = (userId: string) => {
      console.log("🔌 User disconnected:", userId);
    };
  
    // Set up listeners
    socket.on("receiveMessage",handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("userConnected", handleUserConnected);
    socket.on("userDisconnected", handleUserDisconnected);
      socket.onAny((event, ...args) => {
        console.log("🔍 Any socket event:", event, args);
      });
    // Cleanup listeners on unmount
    return () => {
      offReceiveMessage();
      socket.off("typing", handleTyping);
      socket.off("userConnected", handleUserConnected);
      socket.off("userDisconnected", handleUserDisconnected);
    };
  }, []);

  useEffect(() => {
    if (conversation?.jobIds) {
      const roomId = conversation.jobIds[0];
      joinRoom(String(roomId));
      console.log('joined room', String(roomId));
  
      const handleChatHistory = (history: typeof messages) => {
        console.log('histor', history)
        console.log('conversation', conversation)
        setMessages(history); 
      };
  
      socket.on("chatHistory", handleChatHistory);
  
      return () => {
        socket.off("chatHistory", handleChatHistory);
      };
    }
  }, [conversation?.jobIds]);
  

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSubmitting) return;
  
    setIsSubmitting(true);
  
    try {
      const userId = getUserDetails().id;
      sendMessage(conversation.jobIds[0], conversation.participant.id, userId, trimmedMessage);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
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
              <Link href={`/jobs/${jobIds[0]}`} className="hover:underline flex items-center">
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
            messages.map((msg: any, index:number) => <Message key={`${msg.id}-${index}`} message={msg} isOwn={msg.senderId !== participant.id} />)
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
