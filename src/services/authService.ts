
import { apiService } from './api';
import { User, ApiResponse } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    
    if (response.success && response.data) {
      // Guardar token y datos del usuario
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('userEmail', response.data.user.email);
      localStorage.setItem('userName', response.data.user.name);
    }
    
    return response;
  },

  // Registrar nuevo usuario
  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    
    if (response.success && response.data) {
      // Guardar token y datos del usuario
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('userEmail', response.data.user.email);
      localStorage.setItem('userName', response.data.user.name);
    }
    
    return response;
  },

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout', {});
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Limpiar datos locales independientemente del resultado
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userAddress');
    }
  },

  // Obtener perfil del usuario autenticado
  async getProfile(): Promise<ApiResponse<User>> {
    return apiService.get<ApiResponse<User>>('/auth/profile');
  },

  // Actualizar perfil
  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    return apiService.put<ApiResponse<User>>('/auth/profile', updates);
  },

  // Verificar si el token es válido
  async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return false;
      
      await apiService.get('/auth/verify');
      return true;
    } catch {
      return false;
    }
  },

  // Cambiar contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiService.post<ApiResponse<void>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};
