import api from '@/lib/axios';
import { Route, CollectionPoint, CollectorMetrics, ApiResponse } from '@/types';

export const collectorService = {
  // Get current route
  getCurrentRoute: async (): Promise<Route | null> => {
    const response = await api.get<ApiResponse<Route>>('/api/collector/current-route');
    return response.data.data || null;
  },

  // Start route
  startRoute: async (routeId: string): Promise<Route> => {
    const response = await api.post<ApiResponse<Route>>(`/api/collector/routes/${routeId}/start`);
    return response.data.data!;
  },

  // Complete route
  completeRoute: async (routeId: string, notes?: string): Promise<Route> => {
    const response = await api.post<ApiResponse<Route>>(
      `/api/collector/routes/${routeId}/complete`,
      { notes }
    );
    return response.data.data!;
  },

  // Check-in at collection point
  checkIn: async (
    pointId: string,
    data: {
      actualQuantity?: { value: number; unit: string };
      notes?: string;
      photos?: string[];
    }
  ): Promise<CollectionPoint> => {
    const response = await api.post<ApiResponse<CollectionPoint>>(
      `/api/collector/checkin/${pointId}`,
      data
    );
    return response.data.data!;
  },

  // Update location
  updateLocation: async (latitude: number, longitude: number): Promise<void> => {
    await api.post('/api/collector/location', {
      latitude,
      longitude,
    });
  },

  // Get route history
  getRouteHistory: async (params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<Route[]> => {
    const response = await api.get<ApiResponse<Route[]>>('/api/collector/routes/history', {
      params,
    });
    return response.data.data!;
  },

  // Get collector metrics
  getCollectorMetrics: async (): Promise<CollectorMetrics> => {
    const response = await api.get<ApiResponse<CollectorMetrics>>('/api/collector/metrics');
    return response.data.data!;
  },

  // Report issue
  reportIssue: async (data: {
    pointId?: string;
    type: string;
    description: string;
    photos?: string[];
  }): Promise<void> => {
    await api.post('/api/collector/report-issue', data);
  },
};
