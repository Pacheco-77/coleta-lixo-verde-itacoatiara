// User Types
export type UserRole = 'admin' | 'coletor' | 'user';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  cpf?: string;
  photo?: string;
  googleId?: string;
  phone?: string;
  address?: Address;
  collectorInfo?: CollectorInfo;
  notifications?: NotificationPreferences;
  preferences?: UserPreferences;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode?: string;
  location?: GeoLocation;
}

export interface GeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface CollectorInfo {
  vehicleId?: string;
  vehiclePlate?: string;
  vehicleType?: 'truck' | 'van' | 'motorcycle' | 'other';
  licenseNumber?: string;
  currentRoute?: string;
  isActive: boolean;
  totalCollections: number;
  totalKilometers: number;
  rating: number;
  lastLocation?: GeoLocation;
  lastLocationUpdate?: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  push: boolean;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
}

// Collection Point Types
export type CollectionStatus = 'pending' | 'scheduled' | 'in_progress' | 'collected' | 'cancelled';
export type WasteType = 'folhas' | 'galhos' | 'grama' | 'flores' | 'frutas' | 'vegetais' | 'outros';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';

export interface CollectionPoint {
  _id: string;
  citizen: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail?: string;
  address: Address;
  location: GeoLocation;
  wasteType: WasteType;
  estimatedQuantity: Quantity;
  description?: string;
  images?: ImageData[];
  status: CollectionStatus;
  priority: Priority;
  scheduledDate?: string;
  scheduledTimeSlot?: TimeSlot;
  route?: string;
  routeOrder?: number;
  collector?: string;
  collectionInfo?: CollectionInfo;
  notificationsSent?: NotificationStatus;
  feedback?: Feedback;
  statusHistory: StatusHistory[];
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  isActive: boolean;
  isRecurring: boolean;
  recurringSchedule?: RecurringSchedule;
  createdAt: string;
  updatedAt: string;
}

export interface Quantity {
  value: number;
  unit: 'kg' | 'sacos' | 'm3';
}

export interface TimeSlot {
  start: string; // HH:mm
  end: string; // HH:mm
}

export interface ImageData {
  url: string;
  uploadedAt: string;
}

export interface CollectionInfo {
  collectedAt: string;
  actualQuantity?: Quantity;
  notes?: string;
  photos?: ImageData[];
  duration?: number;
}

export interface NotificationStatus {
  scheduled?: { sent: boolean; sentAt?: string };
  dayBefore?: { sent: boolean; sentAt?: string };
  onTheWay?: { sent: boolean; sentAt?: string };
  completed?: { sent: boolean; sentAt?: string };
}

export interface Feedback {
  rating: number;
  comment?: string;
  submittedAt: string;
}

export interface StatusHistory {
  status: CollectionStatus;
  changedBy: string;
  changedAt: string;
  notes?: string;
}

export interface RecurringSchedule {
  frequency: 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number;
  dayOfMonth?: number;
}

// Route Types
export type RouteStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Route {
  _id: string;
  name: string;
  collector: string;
  collectorName?: string;
  points: string[];
  scheduledDate: string;
  status: RouteStatus;
  startTime?: string;
  endTime?: string;
  totalDistance?: number;
  estimatedDuration?: number;
  actualDuration?: number;
  completedPoints: number;
  totalPoints: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Report Types
export interface Report {
  _id: string;
  type: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  data: unknown;
  generatedBy: string;
  generatedAt: string;
  format?: 'pdf' | 'excel' | 'csv';
}

// Dashboard Types
export interface DashboardStats {
  totalCollections: number;
  pendingCollections: number;
  completedToday: number;
  activeCollectors: number;
  totalUsers?: number;
  totalRoutes?: number;
  averageRating?: number;
  totalWasteCollected?: number;
}

export interface CollectorMetrics {
  totalCollections: number;
  completedToday: number;
  totalKilometers: number;
  averageRating: number;
  currentRoute?: Route;
  recentCollections: CollectionPoint[];
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: Partial<Address>;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
  refreshToken?: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Map Types
export interface MapMarker {
  id: string;
  position: [number, number]; // [lat, lng]
  type: 'collection' | 'collector' | 'route';
  data: CollectionPoint | User | Route;
  status?: CollectionStatus | RouteStatus;
}

// Form Types
export interface CollectionPointFormData {
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    zipCode?: string;
    reference?: string;
  };
  wasteType: WasteType;
  estimatedQuantity: {
    value: number;
    unit: 'kg' | 'sacos' | 'm3';
  };
  description?: string;
  scheduledDate?: string;
  priority?: Priority;
}

export interface RouteFormData {
  name: string;
  collector: string;
  points: string[];
  scheduledDate: string;
  notes?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  address?: Partial<Address>;
}

// Statistics Types
export interface PublicStatistics {
  totalCollections: number;
  totalWasteCollected: number;
  activeCollectors: number;
  coverageArea: number;
  monthlyGrowth: number;
  topNeighborhoods: Array<{
    name: string;
    collections: number;
  }>;
}

// Contact Types
export interface ContactInfo {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  workingHours: string;
  emergencyContact?: string;
}

// News Types
export type NewsCategory = 'noticia' | 'evento' | 'alerta' | 'informacao';

export interface News {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  image: string;
  category: NewsCategory;
  author: string | User;
  publishDate: string;
  expiryDate?: string;
  priority: number;
  views: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsFormData {
  title: string;
  content: string;
  summary?: string;
  image: string;
  category: NewsCategory;
  publishDate?: string;
  expiryDate?: string;
  priority?: number;
}

// Helper function to check if user is specific admin
export const isSpecificAdmin = (email: string): boolean => {
  const specificAdmins = ['wamber.pacheco.12@gmail.com', 'apgxavier@gmail.com'];
  return specificAdmins.includes(email.toLowerCase());
};

// Helper function to check user role
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const isColetor = (user: User | null): boolean => {
  return user?.role === 'coletor';
};

export const isUser = (user: User | null): boolean => {
  return user?.role === 'user';
};
