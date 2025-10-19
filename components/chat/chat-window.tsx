"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, MoreVertical, ExternalLink, Phone, PhoneOff } from "lucide-react"
import { getUserDetails } from "@/lib/utils"
import Link from "next/link"
import socket, { joinRoom, offReceiveMessage, sendMessage } from "@/services/socket"
import type { ChatWindowProps } from "@/lib/chat.interface"
import { Message } from "../ui/message"

export default function ChatWindow({ conversation, conversationId, onSendMessage }: ChatWindowProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { participant, jobIds, jobTitle } = conversation
  const [messages, setMessages] = useState<Array<{ id: string; senderId: string; content: string }>>(
    conversation.messages || [],
  )
  const [typing, setTyping] = useState(false)
  const [online, setOnline] = useState(false)
  const [inCall, setInCall] = useState(false)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const isProcessingAnswerRef = useRef(false)
  const hasReceivedAnswerRef = useRef(false) // Track if we've received an answer

  // CALL START
  const startCall = async () => {
    try {
      console.log("🎬 Starting call...")
      hasReceivedAnswerRef.current = false // Reset flag
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = stream
      
      console.log("📹 Local stream obtained:", stream.getTracks().length, "tracks")
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Close existing connection if any
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }

      const pc = new RTCPeerConnection({ 
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ] 
      })
      peerConnectionRef.current = pc

      // Monitor connection states
      pc.onconnectionstatechange = () => {
        console.log("🔄 Connection state:", pc.connectionState)
        
        if (pc.connectionState === "connected") {
          console.log("✅ Peer connection established!")
        } else if (pc.connectionState === "failed") {
          console.error("❌ Connection failed")
        }
      }

      pc.oniceconnectionstatechange = () => {
        console.log("🧊 ICE connection state:", pc.iceConnectionState)
        
        if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
          console.log("✅ ICE connection established!")
        } else if (pc.iceConnectionState === "failed") {
          console.error("❌ ICE connection failed")
          pc.restartIce()
        }
      }

      pc.onsignalingstatechange = () => {
        console.log("📡 Signaling state:", pc.signalingState)
      }

      // Add tracks
      stream.getTracks().forEach((track) => {
        console.log(`➕ Adding ${track.kind} track`)
        pc.addTrack(track, stream)
      })

      pc.ontrack = (event) => {
        console.log("📺 Remote track received:", event.track.kind)
        
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0]
          console.log("✅ Remote stream assigned")
        }
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("🧊 Sending ICE candidate")
          socket.emit("ice-candidate", { 
            candidate: event.candidate, 
            to: participant.id 
          })
        }
      }

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      console.log("✅ Offer created")
      
      socket.emit("offer", { sdp: offer, to: participant.id })
      console.log("📤 Offer sent to:", participant.id)

      setInCall(true)
    } catch (error) {
      console.error("❌ Error starting call:", error)
    }
  }

  // CALL END
  const endCall = () => {
    console.log("📞 Ending call...")
    
    // Stop local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }

    // Clear remote stream
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    isProcessingAnswerRef.current = false
    hasReceivedAnswerRef.current = false
    setInCall(false)
    console.log("✅ Call ended")
  }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // WebRTC signaling handlers
  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }

    // Handle incoming offer
    const handleOffer = async (data: any) => {
      console.log("🎧 Received offer from:", data.from)
      hasReceivedAnswerRef.current = false // Reset flag

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        localStreamRef.current = stream
        console.log("📹 Local stream obtained")

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Close old connection if exists
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close()
        }

        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        })
        peerConnectionRef.current = pc

        pc.onconnectionstatechange = () => {
          console.log("🔄 Connection state:", pc.connectionState)
        }

        pc.oniceconnectionstatechange = () => {
          console.log("🧊 ICE connection state:", pc.iceConnectionState)
          
          if (pc.iceConnectionState === "failed") {
            console.error("❌ ICE connection failed")
            pc.restartIce()
          }
        }

        // Add local tracks
        stream.getTracks().forEach((track) => {
          console.log(`➕ Adding ${track.kind} track`)
          pc.addTrack(track, stream)
        })

        // Handle remote stream
        pc.ontrack = (event) => {
          console.log("📺 Remote track received:", event.track.kind)
          
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0]
            console.log("✅ Remote stream assigned")
          }
        }

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              candidate: event.candidate,
              to: data.from,
            })
          }
        }

        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
        console.log("✅ Remote offer set")

        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        console.log("✅ Answer created")

        socket.emit("answer", { sdp: answer, to: data.from })
        console.log("📤 Answer sent to:", data.from)
        
        setInCall(true)
      } catch (error) {
        console.error("❌ Error handling offer:", error)
      }
    }

    // Handle incoming answer
    const handleAnswer = async (data: any) => {
      console.log("📞 Received answer from:", data.from)
      
      // Check if we've already received and processed an answer
      if (hasReceivedAnswerRef.current) {
        console.warn("⚠️ Already received an answer, ignoring duplicate")
        return
      }

      const pc = peerConnectionRef.current
      
      if (!pc) {
        console.error("❌ No peer connection")
        return
      }

      console.log("Current signaling state:", pc.signalingState)

      if (pc.signalingState !== "have-local-offer") {
        console.warn(`⚠️ Wrong state for answer: ${pc.signalingState}`)
        return
      }

      hasReceivedAnswerRef.current = true // Mark as received

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
        console.log("✅ Remote answer set, new state:", pc.signalingState)
      } catch (error) {
        console.error("❌ Error setting remote answer:", error)
        hasReceivedAnswerRef.current = false // Reset on error
      }
    }

    // Handle ICE candidates
    const handleIceCandidate = async (data: any) => {
      const pc = peerConnectionRef.current
      
      if (!pc || !data.candidate) {
        return
      }

      try {
        if (pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
          console.log("✅ ICE candidate added")
        } else {
          console.warn("⚠️ Remote description not set, queueing candidate")
          setTimeout(() => handleIceCandidate(data), 100)
        }
      } catch (err) {
        console.error("❌ Error adding ICE candidate:", err)
      }
    }

    socket.on("offer", handleOffer)
    socket.on("answer", handleAnswer)
    socket.on("ice-candidate", handleIceCandidate)

    return () => {
      socket.off("offer", handleOffer)
      socket.off("answer", handleAnswer)
      socket.off("ice-candidate", handleIceCandidate)
    }
  }, [])

  // Chat message handlers
  useEffect(() => {
    if (!socket.connected) {
      socket.connect()
    }

    const roomId = String(jobIds[0])
    joinRoom(roomId)
    
    const handleReceiveMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg])
    }

    const handleChatHistory = (history: typeof messages) => {
      setMessages(history)
    }

    socket.on("receiveMessage", handleReceiveMessage)
    socket.on("chatHistory", handleChatHistory)

    socket.on("typing", (data) => {
      if (data.senderId !== getUserDetails().id) {
        setTyping(true)
      }
    })

    socket.on("stopTyping", (data) => {
      if (data.senderId !== getUserDetails().id) {
        setTyping(false)
      }
    })

    socket.on("userConnected", (user) => console.log("🔌 User connected:", user))
    socket.on("userDisconnected", (userId) => console.log("🔌 User disconnected:", userId))
    
    socket.on("userOnline", ({ userId }) => {
      if (userId === conversationId) {
        setOnline(true)
      }
    })

    socket.on("userOffline", ({ userId }) => {
      if (userId === conversationId) {
        setOnline(false)
      }
    })

    return () => {
      offReceiveMessage()
      socket.off("chatHistory", handleChatHistory)
      socket.off("typing")
      socket.off("stopTyping")
      socket.off("userConnected")
      socket.off("userDisconnected")
      socket.off("userOnline")
      socket.off("userOffline")
    }
  }, [jobIds, conversationId])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

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

  const handleTyping = () => {
    const userId = getUserDetails().id
    const roomId = String(conversation.jobIds[0])

    socket.emit("typing", {
      roomId,
      senderId: userId,
    })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        roomId,
        senderId: userId,
      })
    }, 3000)
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="relative">
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
            <span
              className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                online ? "bg-green-500" : "bg-gray-400"
              }`}
              title={online ? "Online" : "Offline"}
            />
          </div>
          <div className="flex gap-3">
            <div>
              <h3 className="font-medium">{participant.name}</h3>
              {typing && <p className="text-sm text-muted-foreground">Typing...</p>}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Link href={`/jobs/${jobIds[0]}`} className="hover:underline flex items-center">
                {jobTitle} <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={startCall}
            disabled={inCall}
            title="Start video call"
            className="hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </Button>

          {inCall && (
            <Button
              variant="ghost"
              size="icon"
              onClick={endCall}
              title="End video call"
              className="hover:bg-red-50 dark:hover:bg-red-950"
            >
              <PhoneOff className="h-5 w-5 text-red-600 dark:text-red-400" />
            </Button>
          )}

          <Button variant="ghost" size="icon" title="More options">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Video Area */}
      {inCall && (
        <div className="video-container flex gap-2 p-2 border-b bg-gray-900">
          <div className="relative">
            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-40 h-40 bg-black rounded object-cover" 
            />
            <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              You
            </span>
          </div>
          <div className="relative">
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-40 h-40 bg-black rounded object-cover" 
            />
            <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {participant.name}
            </span>
          </div>
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
            messages.map((msg, index) => (
              <Message key={`${msg.id}-${index}`} message={msg} isOwn={msg.senderId !== participant.id} />
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
              setMessage(e.target.value)
              handleTyping()
            }}
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