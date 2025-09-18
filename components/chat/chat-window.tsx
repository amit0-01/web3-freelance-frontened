"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, MoreVertical, ExternalLink } from "lucide-react"
import { getUserDetails } from "@/lib/utils"
import Link from "next/link"
import socket, { joinRoom, offReceiveMessage, onReceiveMessage, sendMessage } from "@/services/socket"
import { ChatWindowProps } from "@/lib/chat.interface"
import { Message } from "../ui/message"

export default function ChatWindow({ conversation,conversationId ,onSendMessage }: ChatWindowProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { participant, jobIds, jobTitle } = conversation
  const [messages, setMessages] = useState<Array<{ id: string; senderId: string; content: string }>>(conversation.messages || [])
  const [typing, setTyping] = useState(false)
  const [online, setOnline] = useState(false);
  const [inCall, setInCall] = useState(false);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  let typingTimeout: NodeJS.Timeout;
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  let peerConnection: RTCPeerConnection

  // CALL START
  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    if (localVideoRef.current) localVideoRef.current.srcObject = stream
  
    peerConnection = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] })
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream))
  
    peerConnection.ontrack = event => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0]
    }
  
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate, to: participant.id })
      }
    }
  
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    socket.emit("offer", { sdp: offer, to: participant.id })
  
    // 👇 show video UI
    setInCall(true)
  }  

  // CALL END
  const endCall = () => {
    // Stop local tracks
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach(track => track.stop())
      localVideoRef.current.srcObject = null
    }
  
    // Clear remote stream
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
  
    // Close connection
    if (peerConnection) {
      peerConnection.close()
    }
  
    setInCall(false)
  }
  

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }
  
    // Handle incoming offer
    socket.on("offer", async (data) => {
      peerConnectionRef.current = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] })
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (localVideoRef.current) localVideoRef.current.srcObject = stream
      stream.getTracks().forEach(track => peerConnectionRef.current?.addTrack(track, stream))
  
      peerConnectionRef.current.ontrack = event => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0]
      }
  
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp))
      const answer = await peerConnectionRef.current.createAnswer()
      await peerConnectionRef.current.setLocalDescription(answer)
      socket.emit("answer", { sdp: answer, to: data.from })
    })
  
    // Handle incoming answer
    socket.on("answer", async (data) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp))
      }
    })
  
    // Handle ICE candidates
    socket.on("ice-candidate", async (data) => {
      try {
        if (peerConnectionRef.current && data.candidate) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate))
        }
      } catch (err) {
        console.error("Error adding received ice candidate", err)
      }
    })
  
    return () => {
      socket.off("offer")
      socket.off("answer")
      socket.off("ice-candidate")
    }
  }, [])
  

  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }

    const roomId = String(jobIds[0])
    joinRoom(roomId)
    const handleReceiveMessage = (msg: any) => {
      setMessages((prev: typeof messages) => [...prev, msg])
    }

    const handleChatHistory = (history: typeof messages) => {
      setMessages(history)
    }

    socket.on("receiveMessage", handleReceiveMessage)
    socket.on("chatHistory", handleChatHistory)

    // Optional: additional socket events
    socket.on("typing", (data) => {
      if(data.senderId !== getUserDetails().id) {
      setTyping(true)
      }
    })

    socket.on("stopTyping", (data) => {
      if(data.senderId !== getUserDetails().id) { 
      setTyping(false)
      }
    })
    // socket.on('onlineStatus', (userIds: string[]) => {
    //   userIds.forEach((users:any)=>{
    //     if(users.userId == conversationId){
    //     setOnline(true);
    //     }
    //   })
    // });
    // socket.on('userLastSeen', ({ userId, lastSeen }) => {
    // });
    socket.on("userConnected", user => console.log("🔌 User connected:", user))
    socket.on("userDisconnected", userId => console.log("🔌 User disconnected:", userId))
    socket.on("userOnline", ({ userId, status }) => {
      if(userId == conversationId){
      setOnline(true);
      }
    });

    socket.on("userOffline", ({ userId, lastActive }) => {
      if(userId == conversationId){
      setOnline(false);
      }
    }); 
    // socket.onAny((event, ...args) => console.log("📡 Socket event:", event, args))

    return () => {
      offReceiveMessage()
      socket.off("chatHistory", handleChatHistory)
      socket.off("typing")
      socket.off("userConnected")
      socket.off("userDisconnected")
    }
  }, [jobIds])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = message.trim()
    if (!trimmed || isSubmitting) return

    setIsSubmitting(true)
    try {
      const userId = getUserDetails().id
      sendMessage(jobIds[0], participant.id, userId, trimmed)
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // TYPING HANDLING
  const handleTyping = () => {
    const userId = getUserDetails().id;
    const roomId = String(conversation.jobIds[0]);
  
    socket.emit("typing", {
      roomId, 
      senderId: userId,
    });

    if (typingTimeout) clearTimeout(typingTimeout);

    // Emit "stopTyping" after 3 seconds of inactivity
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", {
        roomId,
        senderId: userId,
      });
    }, 3000);
  };  

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="relative">
            {participant.avatar ? (
              <img
                src={participant.avatar}
                alt={participant.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-medium text-primary">
                  {participant.name.charAt(0)}
                </span>
              </div>
            )}
            {/* Online/Offline Dot */}
            <span
              className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                online ? 'bg-green-500' : 'bg-gray-400'
              }`}
              title={online ? 'Online' : 'Offline'}
            />
          </div>
          <div className="flex gap-3">
            <div>
            <h3 className="font-medium">{participant.name}</h3>
           {typing && <p>Typing ....</p>}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Link href={`/jobs/${jobIds[0]}`} className="hover:underline flex items-center">
                {jobTitle} <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={startCall}>
          📹
        </Button>
        <Button variant="ghost" size="icon" onClick={endCall}>
          ❌
        </Button>

        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>


      {/* Video Area */}
      {inCall && (
        <div className="video-container flex gap-2 p-2 border-b">
          <video ref={localVideoRef} autoPlay muted playsInline className="w-40 h-40 bg-black rounded" />
          <video ref={remoteVideoRef} autoPlay playsInline className="w-40 h-40 bg-black rounded" />
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg: { id: string; senderId: string; content: string }, index) => (
              <Message
                key={`${msg.id}-${index}`}
                message={msg}
                isOwn={msg.senderId !== participant.id}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            disabled={isSubmitting}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || isSubmitting}
            className="flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
