"use client"

import Chatbot from "@/components/chatbot"
import { usePathname } from "next/navigation"

export default function ConditionalChatbot() {
  const pathname = usePathname()

  // Render Chatbot only if the pathname is not "/messages"
  return pathname !== "/messages" ? <Chatbot /> : null
}