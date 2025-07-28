
import { apiService } from './api';
import { User, ApiResponse, PaginatedResponse } from '@/types';

export const userService = {
  // Obtener todos los usuarios (para admins)
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return apiService.get<PaginatedResponse<User>>(
      `/users?${searchParams.toString()}`
    );
  },

  // Obtener usuario por ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiService.get<ApiResponse<User>>(`/users/${id}`);
  },

  // Actualizar usuario (para admins)
  async updateUser(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    return apiService.put<ApiResponse<User>>(`/users/${id}`, updates);
  },

  // Eliminar usuario
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`/users/${id}`);
  },

  // Activar/desactivar usuario
  async updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<ApiResponse<User>> {
    return apiService.patch<ApiResponse<User>>(`/users/${id}/status`, { status });
  },

  // Crear usuario operativo
  async createOperative(userData: {
    name: string;
    email: string;
    username: string;
    phone: string;
  }): Promise<ApiResponse<User>> {
    return apiService.post<ApiResponse<User>>('/users/operatives', userData);
  },

  // Obtener todos los operativos
  async getOperatives(): Promise<ApiResponse<User[]>> {
    return apiService.get<ApiResponse<User[]>>('/users/operatives');
  },
};
