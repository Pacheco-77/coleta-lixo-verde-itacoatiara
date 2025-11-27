import api from '@/lib/axios';
import {
  CollectionPoint,
  CollectionPointFormData,
  ApiResponse,
  PaginatedResponse,
  PublicStatistics,
  ContactInfo,
} from '@/types';

export const citizenService = {
  // Register new collection point
  registerCollectionPoint: async (data: CollectionPointFormData): Promise<CollectionPoint> => {
    const response = await api.post<ApiResponse<CollectionPoint>>(
      '/api/citizen/collection-points',
      data
    );
    return response.data.data!;
  },

  // Get my collection points
  getMyCollectionPoints: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<CollectionPoint>> => {
    const response = await api.get<PaginatedResponse<CollectionPoint>>(
      '/api/citizen/collection-points',
      { params }
    );
    return response.data;
  },

  // Get collection point by ID
  getCollectionPointById: async (id: string): Promise<CollectionPoint> => {
    const response = await api.get<ApiResponse<CollectionPoint>>(
      `/api/citizen/collection-points/${id}`
    );
    return response.data.data!;
  },

  // Update collection point
  updateCollectionPoint: async (
    id: string,
    data: Partial<CollectionPointFormData>
  ): Promise<CollectionPoint> => {
    const response = await api.put<ApiResponse<CollectionPoint>>(
      `/api/citizen/collection-points/${id}`,
      data
    );
    return response.data.data!;
  },

  // Cancel collection point
  cancelCollectionPoint: async (id: string, reason: string): Promise<void> => {
    await api.delete(`/api/citizen/collection-points/${id}`, {
      data: { reason },
    });
  },

  // Get collection schedules (public)
  getCollectionSchedules: async (params?: {
    neighborhood?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<CollectionPoint[]> => {
    const response = await api.get<ApiResponse<CollectionPoint[]>>(
      '/api/citizen/schedules',
      { params }
    );
    return response.data.data!;
  },

  // Get public map data
  getPublicMap: async (): Promise<CollectionPoint[]> => {
    const response = await api.get<ApiResponse<CollectionPoint[]>>('/api/citizen/public-map');
    return response.data.data!;
  },

  // Get public statistics
  getPublicStatistics: async (): Promise<PublicStatistics> => {
    const response = await api.get<ApiResponse<PublicStatistics>>('/api/citizen/statistics');
    return response.data.data!;
  },

  // Get contact info
  getContactInfo: async (): Promise<ContactInfo> => {
    const response = await api.get<ApiResponse<ContactInfo>>('/api/citizen/contact');
    return response.data.data!;
  },
};
