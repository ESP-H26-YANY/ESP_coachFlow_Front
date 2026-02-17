
export interface User {
  id?: string;
  name: string;
  email: string;
  role?: string; 
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}