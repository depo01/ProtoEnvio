
import { apiService } from './api';
import { PickupRequest, ApiResponse, PaginatedResponse } from '@/types';

export const requestService = {
  // Obtener todas las solicitudes (con paginación)
  async getRequests(params?: {
    page?: number;
    limit?: number;
    status?: string;
    clientId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<PaginatedResponse<PickupRequest>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return apiService.get<PaginatedResponse<PickupRequest>>(
      `/requests?${searchParams.toString()}`
    );
  },

  // Obtener solicitud por ID
  async getRequestById(id: string): Promise<ApiResponse<PickupRequest>> {
    return apiService.get<ApiResponse<PickupRequest>>(`/requests/${id}`);
  },

  // Crear nueva solicitud
  async createRequest(request: Omit<PickupRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<PickupRequest>> {
    return apiService.post<ApiResponse<PickupRequest>>('/requests', request);
  },

  // Actualizar solicitud
  async updateRequest(id: string, updates: Partial<PickupRequest>): Promise<ApiResponse<PickupRequest>> {
    return apiService.put<ApiResponse<PickupRequest>>(`/requests/${id}`, updates);
  },

  // Actualizar estado de solicitud
  async updateRequestStatus(id: string, status: PickupRequest['status']): Promise<ApiResponse<PickupRequest>> {
    return apiService.patch<ApiResponse<PickupRequest>>(`/requests/${id}/status`, { status });
  },

  // Eliminar solicitud
  async deleteRequest(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`/requests/${id}`);
  },

  // Obtener solicitudes del cliente autenticado
  async getMyRequests(): Promise<ApiResponse<PickupRequest[]>> {
    return apiService.get<ApiResponse<PickupRequest[]>>('/requests/my-requests');
  },
};
