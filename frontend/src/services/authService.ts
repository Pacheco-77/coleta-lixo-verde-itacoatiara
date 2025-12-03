import api from '@/lib/axios';
import { AuthResponse, LoginCredentials, RegisterData, User, ApiResponse } from '@/types';

export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<{ success: boolean; message: string; data: AuthResponse }>('/api/auth/register', data);
    // A API retorna { success, message, data: { user, token, refreshToken } }
    return {
      success: response.data.success,
      message: response.data.message,
      user: response.data.data.user,
      token: response.data.data.token,
      refreshToken: response.data.data.refreshToken,
    };
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<{ success: boolean; message: string; data: AuthResponse }>('/api/auth/login', credentials);
      // A API retorna { success, message, data: { user, token, refreshToken } }
      return {
        success: response.data.success,
        message: response.data.message,
        user: response.data.data.user,
        token: response.data.data.token,
        refreshToken: response.data.data.refreshToken,
      };
    } catch (error: any) {
      // Em caso de erro 401, a resposta pode não ter a estrutura esperada
      console.error('❌ Login Error:', error);
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  // Get current user
  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/api/auth/me');
    return response.data.data!;
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/api/auth/profile', data);
    return response.data.data!;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.put('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await api.post('/api/auth/refresh-token', { refreshToken });
    return response.data;
  },
};
