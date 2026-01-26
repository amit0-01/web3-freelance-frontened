"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, MoreVertical, ExternalLink, Phone, PhoneOff, ArrowLeft, X, Image as ImageIcon, FileIcon, Loader2 } from "lucide-react"
import { getUserDetails } from "@/lib/utils"
import Link from "next/link"
import socket, { joinRoom, offReceiveMessage, sendMessage } from "@/services/socket"
import type { ChatWindowProps } from "@/types/chat.interface"
import { Message } from "../ui/message"
import { FilePreview } from "@/types/chat.interface"



export default function ChatWindow({ conversation, conversationId, onSendMessage, onBack }: ChatWindowProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { participant, jobIds, jobTitle } = conversation
  const [messages, setMessages] = useState<Array<{ id: string; senderId: string; content: string }>>(
    conversation.messages || [],
  )
  const [typing, setTyping] = useState(false)
  const [online, setOnline] = useState(false)
  const [inCall, setInCall] = useState(false)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const isProcessingAnswerRef = useRef(false)
  const hasReceivedAnswerRef = useRef(false) // Track if we've received an answer

  // CALL START
  const startCall = async () => {
    try {
      console.log("🎬 Starting call...")
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser doesn't support video calls. Please use a modern browser with HTTPS.");
        console.error("getUserMedia is not supported");
        return;
      }
      
      hasReceivedAnswerRef.current = false
      
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
          // Add free TURN servers
          {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
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
        console.log("📺 Remote track received:", event.track.kind, "readyState:", event.track.readyState)
        
        if (event.streams[0]) {
          const remoteStream = event.streams[0]
          
          // Only assign if not already assigned
          if (!remoteStreamRef.current) {
            remoteStreamRef.current = remoteStream
            
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream
              console.log("✅ Remote stream assigned with", remoteStream.getTracks().length, "tracks")
              console.log("   Tracks:", remoteStream.getTracks().map(t => `${t.kind}: ${t.readyState}`))
              
              // Play after a short delay to ensure stream is ready
              setTimeout(() => {
                if (remoteVideoRef.current) {
                  console.log("Attempting to play remote video...")
                  remoteVideoRef.current.play().catch(err => {
                    console.error("Error playing remote video:", err)
                  })
                }
              }, 100)
            }
          } else {
            console.log("📺 Additional track added to existing stream")
            // Check if we need to refresh the video after second track
            if (remoteVideoRef.current && event.track.kind === 'video') {
              console.log("Video track added, ensuring playback...")
              setTimeout(() => {
                remoteVideoRef.current?.play().catch(err => {
                  console.error("Error replaying remote video:", err)
                })
              }, 200)
            }
          }
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
          
          if (event.streams[0]) {
            const remoteStream = event.streams[0]
            
            // Only assign if not already assigned
            if (!remoteStreamRef.current) {
              remoteStreamRef.current = remoteStream
              
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream
                console.log("✅ Remote stream assigned with", remoteStream.getTracks().length, "tracks")
                
                // Play after a short delay to ensure stream is ready
                setTimeout(() => {
                  remoteVideoRef.current?.play().catch(err => {
                    console.error("Error playing remote video:", err)
                  })
                }, 100)
              }
            } else {
              console.log("📺 Additional track added to existing stream")
            }
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: FilePreview[] = []

    for (const file of Array.from(files)) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 10MB limit`)
        continue
      }

      const preview: FilePreview = {
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
        uploading: false,
      }
      newFiles.push(preview)
    }

    const currentLength = selectedFiles.length
    setSelectedFiles((prev) => [...prev, ...newFiles])

    // Auto-upload files after state update
    setTimeout(() => {
      newFiles.forEach((filePreview, i) => {
        uploadFile(currentLength + i, filePreview.file)
      })
    }, 0)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadFile = async (index: number, file: File) => {
    setSelectedFiles((prev) => {
      const filePreview = prev[index]
      if (!filePreview || filePreview.attachment) return prev
      
      const updated = [...prev]
      updated[index] = { ...updated[index], uploading: true }
      return updated
    })

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const data = await response.json()

      setSelectedFiles((prev) => {
        const updated = [...prev]
        updated[index] = {
          ...updated[index],
          attachment: data.attachment,
          uploading: false,
        }
        return updated
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      setSelectedFiles((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], uploading: false }
        return updated
      })
      alert(`Failed to upload ${file.name}`)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updated = [...prev]
      // Revoke object URL if it's an image
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview)
      }
      return updated.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = message.trim()
    const hasFiles = selectedFiles.length > 0 && selectedFiles.every((f) => f.attachment)
    
    if ((!trimmed && !hasFiles) || isSubmitting) return

    setIsSubmitting(true)
    try {
      const userId = getUserDetails().id
      
      // Send message with attachments if any
      if (hasFiles) {
        // If there's only one file and text, combine them
        if (selectedFiles.length === 1 && trimmed) {
          sendMessage(
            jobIds[0],
            participant.id,
            userId,
            trimmed,
            selectedFiles[0].attachment
          )
        } else {
          // Send text first if exists
          if (trimmed) {
            sendMessage(jobIds[0], participant.id, userId, trimmed)
          }
          // Then send each file as a separate message
          for (const filePreview of selectedFiles) {
            if (filePreview.attachment) {
              sendMessage(
                jobIds[0],
                participant.id,
                userId,
                filePreview.attachment.name,
                filePreview.attachment
              )
            }
          }
        }
      } else {
        sendMessage(jobIds[0], participant.id, userId, trimmed)
      }

      setMessage("")
      // Clean up file previews
      selectedFiles.forEach((fp) => {
        if (fp.preview) {
          URL.revokeObjectURL(fp.preview)
        }
      })
      setSelectedFiles([])
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
      <div className="flex items-center justify-between p-3 md:p-4 border-b">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          )}
          <div className="relative flex-shrink-0">
            {participant.avatar ? (
              <img
                src={participant.avatar || "/placeholder.svg"}
                alt={participant.name}
                className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-medium text-primary text-xs md:text-sm">{participant.name.charAt(0)}</span>
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 block h-2.5 w-2.5 md:h-3 md:w-3 rounded-full ring-2 ring-white ${
                online ? "bg-green-500" : "bg-gray-400"
              }`}
              title={online ? "Online" : "Offline"}
            />
          </div>
          <div className="flex gap-0.5 md:gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-medium text-sm md:text-base truncate">{participant.name}</h3>
            </div>
            {typing && <p className="text-xs md:text-sm text-muted-foreground">Typing...</p>}
            <div className="text-xs md:text-sm text-muted-foreground hidden md:flex items-center gap-1">
              <Link href={`/jobs/${jobIds[0]}`} className="hover:underline flex items-center truncate">
                {jobTitle} <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={startCall}
            disabled={inCall}
            title="Start video call"
            className="hover:bg-blue-50 dark:hover:bg-blue-950 h-8 w-8 md:h-10 md:w-10"
          >
            <Phone className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
          </Button>

          {inCall && (
            <Button
              variant="ghost"
              size="icon"
              onClick={endCall}
              title="End video call"
              className="hover:bg-red-50 dark:hover:bg-red-950 h-8 w-8 md:h-10 md:w-10"
            >
              <PhoneOff className="h-4 w-4 md:h-5 md:w-5 text-red-600 dark:text-red-400" />
            </Button>
          )}

          <Button variant="ghost" size="icon" title="More options" className="h-8 w-8 md:h-10 md:w-10">
            <MoreVertical className="h-4 w-4 md:h-5 md:w-5" />
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
              className="w-24 h-24 md:w-40 md:h-40 bg-black rounded object-cover" 
            />
            <span className="absolute bottom-1 left-1 md:bottom-2 md:left-2 bg-black/50 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded">
              You
            </span>
          </div>
          <div className="relative flex-1">
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-full h-24 md:h-40 bg-black rounded object-cover" 
            />
            <span className="absolute bottom-1 left-1 md:bottom-2 md:left-2 bg-black/50 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded">
              {participant.name}
            </span>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 overflow-y-auto p-3 md:p-4">
        <div className="space-y-3 md:space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm md:text-base">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <Message key={`${msg.id}-${index}`} message={msg} isOwn={msg.senderId !== participant.id} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* File Previews */}
      {selectedFiles.length > 0 && (
        <div className="p-3 md:p-4 border-t bg-muted/30">
          <div className="flex gap-2 flex-wrap">
            {selectedFiles.map((filePreview, index) => (
              <div
                key={index}
                className="relative group border rounded-lg overflow-hidden bg-background"
              >
                {filePreview.file.type.startsWith("image/") ? (
                  <div className="relative w-20 h-20 md:w-24 md:h-24">
                    <img
                      src={filePreview.preview}
                      alt={filePreview.file.name}
                      className="w-full h-full object-cover"
                    />
                    {filePreview.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center p-2">
                    <FileIcon className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground mb-1" />
                    <span className="text-[10px] md:text-xs text-center truncate w-full px-1">
                      {filePreview.file.name}
                    </span>
                    {filePreview.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3 md:h-4 md:w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 md:p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-1.5 md:gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,application/pdf,.doc,.docx,.txt,.xls,.xlsx"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
          >
            <Paperclip className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              handleTyping()
            }}
            disabled={isSubmitting}
            className="flex-1 text-sm md:text-base h-8 md:h-10"
          />
          <Button
            type="submit"
            size="icon"
            disabled={(!message.trim() && selectedFiles.length === 0) || isSubmitting || isUploading}
            className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
            ) : (
              <Send className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}