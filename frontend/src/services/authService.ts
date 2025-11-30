import api from '@/lib/axios';
import { AuthResponse, LoginCredentials, RegisterData, User, ApiResponse } from '@/types';

export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // TEMPORÁRIO: Usando rota de setup enquanto a rota oficial não funciona
    const response = await api.post<{ success: boolean; message: string; data: AuthResponse }>('/api/setup/temp-login', credentials);
    // A API retorna { success, message, data: { user, token, refreshToken } }
    // Mas precisamos retornar apenas { success, message, user, token, refreshToken }
    return {
      success: response.data.success,
      message: response.data.message,
      user: response.data.data.user,
      token: response.data.data.token,
      refreshToken: response.data.data.refreshToken,
    };
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
