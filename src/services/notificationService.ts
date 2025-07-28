
import { apiService } from './api';
import { ApiResponse, PaginatedResponse } from '@/types';

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

export const notificationService = {
  // Obtener notificaciones del usuario
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    read?: boolean;
    type?: string;
  }): Promise<PaginatedResponse<Notification>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return apiService.get<PaginatedResponse<Notification>>(
      `/notifications?${searchParams.toString()}`
    );
  },

  // Marcar notificación como leída
  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    return apiService.patch<ApiResponse<Notification>>(`/notifications/${id}/read`, {});
  },

  // Marcar todas las notificaciones como leídas
  async markAllAsRead(): Promise<ApiResponse<void>> {
    return apiService.patch<ApiResponse<void>>('/notifications/mark-all-read', {});
  },

  // Eliminar notificación
  async deleteNotification(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`/notifications/${id}`);
  },

  // Obtener conteo de notificaciones no leídas
  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return apiService.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
  },

  // Crear notificación (para admins)
  async createNotification(notification: {
    userIds: string[] | 'all';
    title: string;
    message: string;
    type: Notification['type'];
    relatedEntity?: Notification['relatedEntity'];
  }): Promise<ApiResponse<Notification[]>> {
    return apiService.post<ApiResponse<Notification[]>>('/notifications', notification);
  },
};
