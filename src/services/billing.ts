import { api } from './api';
import { API_ENDPOINTS } from '../config/api';
import { RechargeRequest } from '../types/billing';

export const billingService = {
  recharge: async (userId: string, request: RechargeRequest) => {
    const { data } = await api.post(API_ENDPOINTS.recharge, {
      user_id: userId,
      ...request,
    });
    return data;
  },
};