import { api } from './api';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth';
import { API_ENDPOINTS } from '../config/api';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const { data } = await api.post(API_ENDPOINTS.login, credentials);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    try {
      const { data } = await api.post(API_ENDPOINTS.register, credentials);
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
};