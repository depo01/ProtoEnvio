
// Exportaciones centralizadas de todos los servicios
export { apiService } from './api';
export { authService } from './authService';
export { requestService } from './requestService';
export { userService } from './userService';
export { serviceService } from './serviceService';
export { routeService } from './routeService';
export { statsService } from './statsService';
export { notificationService } from './notificationService';

// Re-exportar tipos comunes de servicios
export type { LoginCredentials, RegisterData, AuthResponse } from './authService';
export type { Route } from './routeService';
export type { DashboardStats, RevenueStats, ClientStats } from './statsService';
export type { Notification } from './notificationService';
