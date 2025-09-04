export interface User {
  id: number;
  email: string;
  name: string;
  role: 'player' | 'admin';
  balance: number;
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus';
  amount: number;
  description?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference_id?: string;
  created_at: string;
}

export interface GameSession {
  id: number;
  user_id: number;
  game_type: string;
  bet_amount: number;
  win_amount: number;
  result: any;
  created_at: string;
}

export interface Deposit {
  id: number;
  user_id: number;
  amount: number;
  payment_method: string;
  payment_reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  processed_at?: string;
}

export interface UserSession {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface DepositRequest {
  amount: number;
  payment_method: string;
  payment_reference?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}
