export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  credits: number;
  avatar?: string | null;
  provider?: string | null;
  email_verified: boolean;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}
