export interface Payment {
  id: string;
  amount: number;
  timestamp: string;
}

export interface RechargeRequest {
  amount: number;
}