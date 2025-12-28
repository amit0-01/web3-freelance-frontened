
export interface ChatbotResponse {
  status: string;
  message?: string;
  data?: {
    response: string;
    conversationId?: string;
  };
}