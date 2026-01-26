import axiosInstance from "@/lib/axiosInstance";
import { ChatbotResponse } from "@/types/chatbot.interface";

export const chatbotService = {
  async sendMessage(message: string, conversationId?: string, userId?: string): Promise<ChatbotResponse> {
    try {
      const response = await axiosInstance.post("/chatbot/message", {
        message,
        conversationId: conversationId || undefined,
        userId: userId || undefined,
      });

      return response.data;
    } catch (error) {
      console.error("[ChatbotService] Error sending message:", error);
      throw error;
    }
  },
};
