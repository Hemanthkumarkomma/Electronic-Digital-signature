export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  email: string;
  fullName: string;
  role: string;
  exhibitorType: string;
}

export interface LoginResponse {
  token: string;
  expiresAtUtc: string;
  email: string;
  fullName: string;
  role: string;
  exhibitorType: string;
}
