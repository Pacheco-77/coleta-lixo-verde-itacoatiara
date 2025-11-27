import api from '@/lib/axios';
import {
  User,
  Route,
  Report,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
  UserFormData,
  RouteFormData,
  CollectionPoint,
} from '@/types';

export const adminService = {
  // Dashboard
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/api/admin/dashboard');
    return response.data.data!;
  },

  // Map data
  getMapData: async (): Promise<{
    collectors: User[];
    routes: Route[];
    points: CollectionPoint[];
  }> => {
    const response = await api.get('/api/admin/map');
    return response.data.data!;
  },

  // Users Management
  getUsers: async (params?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/api/admin/users', { params });
    return response.data;
  },

  createUser: async (data: UserFormData): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/api/admin/users', data);
    return response.data.data!;
  },

  updateUser: async (userId: string, data: Partial<UserFormData>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/api/admin/users/${userId}`, data);
    return response.data.data!;
  },

  toggleUserStatus: async (userId: string): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(
      `/api/admin/users/${userId}/toggle-status`
    );
    return response.data.data!;
  },

  // Routes Management
  getRoutes: async (params?: {
    status?: string;
    collector?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Route>> => {
    const response = await api.get<PaginatedResponse<Route>>('/api/admin/routes', { params });
    return response.data;
  },

  createRoute: async (data: RouteFormData): Promise<Route> => {
    const response = await api.post<ApiResponse<Route>>('/api/admin/routes', data);
    return response.data.data!;
  },

  updateRoute: async (routeId: string, data: Partial<RouteFormData>): Promise<Route> => {
    const response = await api.put<ApiResponse<Route>>(`/api/admin/routes/${routeId}`, data);
    return response.data.data!;
  },

  deleteRoute: async (routeId: string): Promise<void> => {
    await api.delete(`/api/admin/routes/${routeId}`);
  },

  // Reports
  getReports: async (params?: {
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Report>> => {
    const response = await api.get<PaginatedResponse<Report>>('/api/admin/reports', { params });
    return response.data;
  },

  generateReport: async (data: {
    type: string;
    startDate: string;
    endDate: string;
    filters?: Record<string, any>;
  }): Promise<Report> => {
    const response = await api.post<ApiResponse<Report>>('/api/admin/reports/generate', data);
    return response.data.data!;
  },

  exportReport: async (reportId: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> => {
    const response = await api.get(`/api/admin/reports/${reportId}/export/${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Performance History
  getPerformanceHistory: async (params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<any[]> => {
    const response = await api.get('/api/admin/performance', { params });
    return response.data.data!;
  },
};
