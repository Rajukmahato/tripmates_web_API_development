'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Avatar } from '@/app/_components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Users, Calendar } from 'lucide-react';
import { getProfileImageUrl } from '@/app/_utils/cn';

export interface ChatListItem {
  id: string;
  type: 'private' | 'group';
  title: string;
  href: string;
  avatarName?: string;
  avatarImagePath?: string | null;
  tripImage?: string | null;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount?: number;
  isSelected?: boolean;
}

interface ConversationListProps {
  conversations: ChatListItem[];
  isLoading: boolean;
}

export function ConversationList({
  conversations,
  isLoading,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] gap-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600"></div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] gap-4 sm:gap-6 p-4 sm:p-6 text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="space-y-1 sm:space-y-2 max-w-md px-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">No messages yet</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Connect with travel buddies to start chatting
          </p>
        </div>
        <div className="space-y-2 sm:space-y-3 w-full max-w-sm px-4">
          <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-left">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Accept partner requests and start chatting</p>
          </div>
          <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-left">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Join trips and connect with teammates</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0 animate-fadeIn">
      {conversations.map((conversation) => (
        <Link
          key={conversation.id}
          href={conversation.href}
        >
          <div
            className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 transition-all hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer border-b border-gray-100 dark:border-slate-800 ${
              conversation.isSelected
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : 'bg-white dark:bg-slate-900'
            }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0 overflow-hidden rounded-full h-11 w-11 sm:h-12 sm:w-12">
              {conversation.type === 'private' ? (
                conversation.avatarImagePath ? (
                  <Image
                    src={getProfileImageUrl(conversation.avatarImagePath) || ''}
                    alt={conversation.avatarName || 'User'}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <Avatar 
                    name={conversation.avatarName}
                    profileImagePath={conversation.avatarImagePath}
                    className="h-11 w-11 sm:h-12 sm:w-12"
                  />
                )
              ) : (
                conversation.tripImage ? (
                  <Image
                    src={getProfileImageUrl(conversation.tripImage) || ''}
                    alt={conversation.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                )
              )}
              {(conversation.unreadCount ?? 0) > 0 && (
                <div className="absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 flex items-center justify-center z-10">
                  <span className="text-[9px] sm:text-[10px] font-bold text-white">{(conversation.unreadCount ?? 0) > 9 ? '9+' : (conversation.unreadCount ?? 0)}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-1.5 sm:gap-2 mb-0.5">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-[15px]">
                  {conversation.title}
                </h3>
                {conversation.lastMessage && (
                  <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 flex-shrink-0 font-medium">
                    {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                      addSuffix: false,
                    })}
                  </span>
                )}
              </div>
              {conversation.lastMessage ? (
                <p className={`text-xs sm:text-[13px] truncate leading-tight ${
                  (conversation.unreadCount ?? 0) > 0 
                    ? 'text-gray-900 dark:text-white font-medium' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {conversation.lastMessage.content}
                </p>
              ) : (
                <p className="text-xs sm:text-[13px] text-gray-500 dark:text-gray-500 italic">Start a conversation</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
