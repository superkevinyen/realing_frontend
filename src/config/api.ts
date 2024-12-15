// API 基礎 URL
export const API_BASE_URL = 'http://localhost:8000';

// API 端點
export const API_ENDPOINTS = {
  login: '/login',
  register: '/register',
  chat: '/v1/chat/completions',
  account: '/account',
  recharge: '/recharge',
  chatHistory: (userId: string) => `/chats/${userId}`,
} as const;