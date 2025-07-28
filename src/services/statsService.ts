
import { apiService } from './api';
import { ApiResponse } from '@/types';

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

export const statsService = {
  // Estadísticas del dashboard
  async getDashboardStats(dateRange?: {
    from: string;
    to: string;
  }): Promise<ApiResponse<DashboardStats>> {
    const params = dateRange ? `?from=${dateRange.from}&to=${dateRange.to}` : '';
    return apiService.get<ApiResponse<DashboardStats>>(`/stats/dashboard${params}`);
  },

  // Estadísticas de ingresos
  async getRevenueStats(period: 'daily' | 'monthly' | 'yearly' = 'monthly'): Promise<ApiResponse<RevenueStats>> {
    return apiService.get<ApiResponse<RevenueStats>>(`/stats/revenue?period=${period}`);
  },

  // Estadísticas de clientes
  async getClientStats(): Promise<ApiResponse<ClientStats>> {
    return apiService.get<ApiResponse<ClientStats>>('/stats/clients');
  },

  // Exportar reportes
  async exportReport(params: {
    type: 'requests' | 'revenue' | 'clients';
    format: 'csv' | 'excel' | 'pdf';
    dateFrom?: string;
    dateTo?: string;
    filters?: Record<string, any>;
  }): Promise<Blob> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/reports/export?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al exportar reporte');
    }

    return response.blob();
  },
};
