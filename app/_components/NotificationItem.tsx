'use client';

import Link from 'next/link';
import { Notification } from '@/app/_types/common.types';
import { formatDistanceToNow } from 'date-fns';
import { Bell, MessageSquare, CheckCircle2, Star, AlertCircle, Check } from 'lucide-react';
import { Avatar } from '@/app/_components/ui/avatar';
import { Button } from '@/app/_components/ui/button';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'request':
        return <AlertCircle className="h-5 w-5 text-purple-600" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'match':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'system':
        return <Bell className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  const getIconBgColor = () => {
    switch (notification.type) {
      case 'message':
        return 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30';
      case 'request':
        return 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30';
      case 'review':
        return 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30';
      case 'match':
        return 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30';
      case 'system':
        return 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30';
      default:
        return 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/30 dark:to-gray-700/30';
    }
  };

  const getLink = () => {
    const relatedId = notification.data?.relatedId;
    switch (notification.type) {
      case 'message':
        return relatedId ? `/user/chat/${relatedId}` : '/user/chat';
      case 'review':
        return relatedId ? `/user/reviews/${relatedId}` : '/user/reviews/submit';
      case 'request':
        return '/user/requests/received';
      case 'match':
        return '/user/trips';
      default:
        return null;
    }
  };

  const link = getLink();

  // Extract user info from notification data if available
  const senderName = notification.data?.senderName as string | undefined;
  const senderImage = notification.data?.senderImage as string | undefined;
  const userName = notification.data?.userName as string | undefined;
  const userImage = notification.data?.userImage as string | undefined;

  // Determine which user info to display (sender takes priority for messages/requests)
  const displayName = senderName || userName;
  const displayImage = senderImage || userImage;

  const content = (
    <div
      className={`flex gap-4 px-4 sm:px-5 py-4 rounded-xl border-2 transition-all ${
        notification.isRead
          ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600'
      } hover:shadow-md`}
    >
      {/* User Avatar or Icon */}
      <div className="flex-shrink-0 mt-1">
        {displayName && displayImage ? (
          <Avatar
            size="md"
            name={displayName}
            profileImagePath={displayImage}
            className="ring-2 ring-white dark:ring-slate-800"
          />
        ) : (
          <div className={`h-10 w-10 rounded-full ${getIconBgColor()} flex items-center justify-center`}>
            {getIcon()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => !notification.isRead && onRead(notification._id)}>
        <h3 className="font-medium text-gray-900 dark:text-white">
          {notification.title}
        </h3>
        {(notification.message || notification.body || (notification.data?.body as string)) && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {notification.message || notification.body || (notification.data?.body as string)}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {!notification.isRead && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onRead(notification._id);
            }}
            className="hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 gap-1.5 h-auto py-1"
            title="Mark as read"
          >
            <Check className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-medium">Mark read</span>
          </Button>
        )}

        {!notification.isRead && (
          <div className="flex-shrink-0">
            <div className="h-3 w-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return <div>{content}</div>;
}
