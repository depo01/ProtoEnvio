
// Tipos centralizados para toda la aplicación
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'client' | 'admin' | 'operative';
  status?: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
}

export interface Client extends User {
  role: 'client';
  totalRequests: number;
  registrationDate: string;
}

export interface OperativeUser extends User {
  role: 'operative';
  username: string;
  mustSetPassword: boolean;
  password?: string;
}

export interface PackageData {
  id: string;
  packageType: string;
  weight: string;
  description: string;
}

export interface PickupRequest {
  id: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  origin: string;
  destination: string;
  packageType: string;
  weight: string;
  description: string;
  date: string;
  status: "pendiente" | "confirmado" | "en-transito" | "entregado" | "cancelado";
  price: number;
  operativeId?: string;
  operativeName?: string;
  routeId?: string;
  packages?: PackageData[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceType {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  multiplier: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientPricing {
  id?: string;
  clientId: string;
  serviceId: string;
  customPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Zone {
  id: string;
  name: string;
  multiplier: number;
  isActive?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  }[];
}

export interface Route {
  id: string;
  name: string;
  date: string;
  operativeId: string;
  operativeName: string;
  requests: PickupRequest[];
  status: 'pending' | 'in-progress' | 'completed';
  estimatedDuration?: number;
  actualDuration?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  relatedEntity?: {
    type: 'request' | 'route' | 'user';
    id: string;
  };
  createdAt: string;
  readAt?: string;
}

// Estadísticas
export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeClients: number;
  totalClients: number;
  averageDeliveryTime: number;
}

export interface RevenueStats {
  daily: Array<{ date: string; revenue: number; requests: number }>;
  monthly: Array<{ month: string; revenue: number; requests: number }>;
  yearly: Array<{ year: string; revenue: number; requests: number }>;
}

export interface ClientStats {
  topClients: Array<{
    id: string;
    name: string;
    email: string;
    totalRequests: number;
    totalRevenue: number;
  }>;
  newClients: Array<{
    id: string;
    name: string;
    email: string;
    registrationDate: string;
  }>;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Error type
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
