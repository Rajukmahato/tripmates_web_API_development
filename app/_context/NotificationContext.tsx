'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { Notification } from '@/app/_types/common.types';
import { useAuth } from './AuthContext';
import {
  getNotifications,
  markAsRead as markAsReadAPI,
  markAllAsRead as markAllAsReadAPI,
  registerFcmToken,
} from '@/lib/api/notifications';
import { connectSocket, getSocket } from '@/lib/websocket/socket';
import { getAuthToken } from '@/app/_utils/cookies';
import { buildCacheKey, getCached, setCached } from '@/app/_utils/client-cache';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoadingNotifications: boolean;
  error: string | null;

  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  registerPushToken: (token: string) => Promise<void>;
  clearError: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheTtlMs = 60_000;

  useEffect(() => {
    if (!user?._id) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const cachedNotifications = getCached<Notification[]>(
      buildCacheKey('notifications', user._id)
    );
    const cachedUnread = getCached<number>(
      buildCacheKey('notifications:unread', user._id)
    );

    if (cachedNotifications?.length) {
      setNotifications(cachedNotifications);
    }

    if (typeof cachedUnread === 'number') {
      setUnreadCount(cachedUnread);
    }
  }, [user]);

  // Listen for real-time notifications via socket
  useEffect(() => {
    if (!user) return;

    let cleanup = () => undefined;

    const initSocket = async () => {
      const token = await getAuthToken();
      if (token) {
        connectSocket(token);
      }

      const socket = getSocket();
      if (!socket) return;

      const handleNewNotification = (notification: Notification) => {
        setNotifications((prev) => {
          const updated = [notification, ...prev];
          if (user?._id) {
            setCached(buildCacheKey('notifications', user._id), updated, cacheTtlMs);
          }
          return updated;
        });
        setUnreadCount((prev) => {
          const updated = prev + 1;
          if (user?._id) {
            setCached(buildCacheKey('notifications:unread', user._id), updated, cacheTtlMs);
          }
          return updated;
        });
      };

      socket.on('newNotification', handleNewNotification);
      cleanup = () => {
        socket.off('newNotification', handleNewNotification);
      };
    };

    initSocket();

    return () => {
      cleanup();
    };
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setIsLoadingNotifications(true);
    setError(null);

    try {
      console.log('[NotificationContext] Fetching notifications for user:', user._id);
      const response = await getNotifications();
      console.log('[NotificationContext] API Response:', response);
      const data = Array.isArray(response.data) ? response.data : [];
      console.log('[NotificationContext] Notifications data:', data);
      setNotifications(data);
      const unread = data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
      console.log('[NotificationContext] Unread count:', unread);

      if (user?._id) {
        setCached(buildCacheKey('notifications', user._id), data, cacheTtlMs);
        setCached(buildCacheKey('notifications:unread', user._id), unread, cacheTtlMs);
      }
    } catch (err) {
      console.error('[NotificationContext] Failed to fetch notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [user]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await markAsReadAPI(notificationId);
        setNotifications((prev) => {
          const updated = prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          );

          if (user?._id) {
            setCached(buildCacheKey('notifications', user._id), updated, cacheTtlMs);
          }

          return updated;
        });
        setUnreadCount((prev) => {
          const updated = Math.max(0, prev - 1);
          if (user?._id) {
            setCached(buildCacheKey('notifications:unread', user._id), updated, cacheTtlMs);
          }
          return updated;
        });
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
        setError('Failed to update notification');
      }
    },
    [user]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllAsReadAPI();
      setNotifications((prev) => {
        const updated = prev.map((n) => ({ ...n, isRead: true }));

        if (user?._id) {
          setCached(buildCacheKey('notifications', user._id), updated, cacheTtlMs);
        }

        return updated;
      });
      setUnreadCount(() => {
        if (user?._id) {
          setCached(buildCacheKey('notifications:unread', user._id), 0, cacheTtlMs);
        }
        return 0;
      });
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      setError('Failed to update notifications');
    }
  }, [user]);

  const registerPushToken = useCallback(async (token: string) => {
    if (!user) return;

    try {
      await registerFcmToken(token);
    } catch (err) {
      console.error('Failed to register FCM token:', err);
      // Don't set error as this is non-critical
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoadingNotifications,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    registerPushToken,
    clearError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
