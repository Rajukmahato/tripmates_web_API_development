'use client';

import { useEffect } from 'react';
import { useNotification } from '@/app/_context/NotificationContext';
import { useAuth } from '@/app/_context/AuthContext';
import { NotificationItem } from '@/app/_components/NotificationItem';
import { Button } from '@/app/_components/ui/button';
import { Loading } from '@/app/_components/ui/loading';
import { Badge } from '@/app/_components/ui/badge';
import { Bell, AlertCircle } from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    isLoadingNotifications,
    markAsRead,
    markAllAsRead,
    error,
  } = useNotification();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-5xl px-6 lg:px-8 mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                {user && ` for ${user.fullName}`}
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              className="font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all"
              size="sm"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl px-6 lg:px-8 mx-auto py-8">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 animate-slideInDown">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">Error loading notifications</h3>
                <p className="text-sm text-red-800 dark:text-red-300 mb-4">{error}</p>
                <Button 
                  onClick={fetchNotifications} 
                  variant="outline"
                  className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {isLoadingNotifications ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loading size="lg" text="Loading your notifications..." />
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-12 text-center animate-slideInUp">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                <Bell className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              All caught up!
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              You&apos;re all set. Notifications will appear here when you have new activity on trips, messages, requests, and more.
            </p>
          </div>
        ) : (
          <div className="space-y-3 animate-slideInUp">
            {notifications.map((notification, index) => (
              <div key={notification._id} className="animate-slideInDown" style={{ animationDelay: `${index * 50}ms` }}>
                <NotificationItem
                  notification={notification}
                  onRead={markAsRead}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
