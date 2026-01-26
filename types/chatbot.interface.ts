
export interface ChatbotResponse {
  status: string;
  message?: string;
  data?: {
    response: string;
    conversationId?: string;
  };
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}