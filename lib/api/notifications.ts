import { apiClient } from '@/lib/api/axios';
import { Notification } from '@/lib/types';

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function getNotifications(page = 1, limit = 20): Promise<NotificationsResponse> {
  try {
    console.log('[Notifications API] Fetching notifications:', { page, limit });
    const response = await apiClient.get(`/api/notifications?page=${page}&limit=${limit}`);
    console.log('[Notifications API] Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Notifications API] Error fetching notifications:', error);
    throw error;
  }
}

export async function markAsRead(notificationId: string): Promise<void> {
  try {
    await apiClient.put(`/api/notifications/${notificationId}/read`);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

export async function markAllAsRead(): Promise<void> {
  try {
    await apiClient.put('/api/notifications/read-all');
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const response = await apiClient.get('/api/notifications/unread-count');
    const data = response.data.data || response.data;
    return typeof data === 'number' ? data : data.count || 0;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    throw error;
  }
}

export async function registerFcmToken(token: string): Promise<void> {
  try {
    await apiClient.post('/api/notifications/register-token', { token });
  } catch (error) {
    console.error('Error registering FCM token:', error);
    throw error;
  }
}
