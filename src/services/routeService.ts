
import { apiService } from './api';
import { PickupRequest, ApiResponse } from '@/types';

export interface Route {
  id: string;
  name: string;
  date: string;
  operativeId: string;
  operativeName: string;
  requests: PickupRequest[];
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

export const routeService = {
  // Obtener todas las rutas
  async getRoutes(params?: {
    date?: string;
    operativeId?: string;
    status?: string;
  }): Promise<ApiResponse<Route[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return apiService.get<ApiResponse<Route[]>>(
      `/routes?${searchParams.toString()}`
    );
  },

  // Obtener ruta por ID
  async getRouteById(id: string): Promise<ApiResponse<Route>> {
    return apiService.get<ApiResponse<Route>>(`/routes/${id}`);
  },

  // Crear nueva ruta
  async createRoute(route: {
    name: string;
    date: string;
    operativeId: string;
    requestIds: string[];
  }): Promise<ApiResponse<Route>> {
    return apiService.post<ApiResponse<Route>>('/routes', route);
  },

  // Actualizar ruta
  async updateRoute(id: string, updates: Partial<Route>): Promise<ApiResponse<Route>> {
    return apiService.put<ApiResponse<Route>>(`/routes/${id}`, updates);
  },

  // Eliminar ruta
  async deleteRoute(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`/routes/${id}`);
  },

  // Asignar solicitud a operativo
  async assignRequestToOperative(requestId: string, operativeId: string): Promise<ApiResponse<PickupRequest>> {
    return apiService.patch<ApiResponse<PickupRequest>>(`/requests/${requestId}/assign`, { operativeId });
  },

  // Obtener rutas de un operativo específico
  async getOperativeRoutes(operativeId: string, date?: string): Promise<ApiResponse<Route[]>> {
    const params = date ? `?date=${date}` : '';
    return apiService.get<ApiResponse<Route[]>>(`/routes/operative/${operativeId}${params}`);
  },
};
