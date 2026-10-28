import { apiClient } from '../api/apiClient';
import {
  LoginRequestDto,
  AuthResponseDto,
  AdminProfileDto,
  ChangePasswordRequestDto,
} from './dto/auth.dto';

const TOKEN_KEY = 'savitri_auth_token';
const USER_KEY = 'savitri_auth_admin';

class AuthService {
  /**
   * Logs into the administrative portal using email and password.
   */
  async login(credentials: LoginRequestDto): Promise<AuthResponseDto> {
    const data = await apiClient.post<AuthResponseDto>('/auth/login', credentials);
    if (data?.accessToken && data?.admin) {
      this.setSession(data.accessToken, data.admin);
    }
    return data;
  }

  /**
   * Validates the active JWT session and retrieves the admin profile from the backend.
   */
  async getProfile(): Promise<AdminProfileDto> {
    const profile = await apiClient.get<AdminProfileDto>('/auth/profile');
    if (profile && typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
    }
    return profile;
  }

  /**
   * Updates admin password after verifying current credentials.
   */
  async changePassword(dto: ChangePasswordRequestDto): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/change-password', dto);
  }

  /**
   * Logs out admin, notifies backend, and clears client token storage.
   */
  async logout(): Promise<void> {
    try {
      if (this.getToken()) {
        await apiClient.post('/auth/logout');
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      this.clearSession();
    }
  }

  /**
   * Session Management Helpers
   */
  setSession(token: string, user: AdminProfileDto): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Set cookie/flag for immediate fast checks if needed
    localStorage.setItem('admin_authenticated', 'true');
  }

  clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('admin_authenticated');
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): AdminProfileDto | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

