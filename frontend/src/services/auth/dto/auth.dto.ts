export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AdminProfileDto {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface AuthResponseDto {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  admin: AdminProfileDto;
}

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
}

