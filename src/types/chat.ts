export interface ChatMessage {
  id: string;
  input_text: string;
  response_text: string;
  tokens_used: number;
  amount_used: number;
  timestamp: string;
}

export interface ChatRequest {
  input_text: string;
}

export interface ChatResponse {
  response: string;
  tokens_used: number;
  amount_used: number;
  remaining_balance: number;
  remaining_tokens: number;
}