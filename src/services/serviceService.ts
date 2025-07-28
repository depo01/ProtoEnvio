
import { apiService } from './api';
import { ServiceType, ClientPricing, Zone, ApiResponse, PaginatedResponse } from '@/types';

export const serviceService = {
  // Obtener todos los servicios
  async getServices(params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<PaginatedResponse<ServiceType>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return apiService.get<PaginatedResponse<ServiceType>>(
      `/services?${searchParams.toString()}`
    );
  },

  // Obtener servicio por ID
  async getServiceById(id: string): Promise<ApiResponse<ServiceType>> {
    return apiService.get<ApiResponse<ServiceType>>(`/services/${id}`);
  },

  // Crear nuevo servicio
  async createService(service: Omit<ServiceType, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ServiceType>> {
    return apiService.post<ApiResponse<ServiceType>>('/services', service);
  },

  // Actualizar servicio
  async updateService(id: string, updates: Partial<ServiceType>): Promise<ApiResponse<ServiceType>> {
    return apiService.put<ApiResponse<ServiceType>>(`/services/${id}`, updates);
  },

  // Eliminar servicio
  async deleteService(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`/services/${id}`);
  },

  // Gestión de precios personalizados por cliente
  async getClientPricing(clientId: string): Promise<ApiResponse<ClientPricing[]>> {
    return apiService.get<ApiResponse<ClientPricing[]>>(`/services/client-pricing/${clientId}`);
  },

  async setClientPricing(pricing: Omit<ClientPricing, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ClientPricing>> {
    return apiService.post<ApiResponse<ClientPricing>>('/services/client-pricing', pricing);
  },

  async updateClientPricing(id: string, updates: Partial<ClientPricing>): Promise<ApiResponse<ClientPricing>> {
    return apiService.put<ApiResponse<ClientPricing>>(`/services/client-pricing/${id}`, updates);
  },

  // Gestión de zonas
  async getZones(): Promise<ApiResponse<Zone[]>> {
    return apiService.get<ApiResponse<Zone[]>>('/services/zones');
  },

  async createZone(zone: Omit<Zone, 'id'>): Promise<ApiResponse<Zone>> {
    return apiService.post<ApiResponse<Zone>>('/services/zones', zone);
  },

  async updateZone(id: string, updates: Partial<Zone>): Promise<ApiResponse<Zone>> {
    return apiService.put<ApiResponse<Zone>>(`/services/zones/${id}`, updates);
  },

  async deleteZone(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`/services/zones/${id}`);
  },
};
