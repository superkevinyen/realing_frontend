import { api } from './api';
import { API_ENDPOINTS } from '../config/api';
import { ChatRequest, ChatResponse, ChatMessage } from '../types/chat';
import { useAuthStore } from '../store/authStore';

export const chatService = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const { user } = useAuthStore.getState();
    const { data } = await api.post(API_ENDPOINTS.chat, {
      user_id: user?.user_id,
      input_text: request.input_text,
    });
    return data;
  },

  getChatHistory: async (userId: string): Promise<ChatMessage[]> => {
    const { data } = await api.get(`/chats/${userId}`);
    return data;
  },
};