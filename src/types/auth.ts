export interface User {
  user_id: string;
  username: string;
  balance: number;
  available_tokens: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}