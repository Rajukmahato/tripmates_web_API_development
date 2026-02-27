'use client';

import { Message } from '@/app/_types/common.types';
import { Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = format(new Date(message.createdAt), 'HH:mm');

  return (
    <div className={`flex items-end gap-1.5 sm:gap-2 mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
          {message.sender?.fullName?.charAt(0).toUpperCase() || '?'}
        </div>
      )}
      
      <div
        className={`group relative max-w-[75%] sm:max-w-[70%] lg:max-w-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all ${
          isOwn
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
            : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-700 rounded-bl-sm shadow-sm'
        }`}
      >
        <p className="text-[13px] sm:text-[15px] leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
        
        <div className={`flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1 ${
          isOwn ? 'justify-end' : 'justify-start'
        }`}>
          <span
            className={`text-[10px] sm:text-[11px] font-medium ${
              isOwn
                ? 'text-white/75'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {time}
          </span>
          {isOwn && (
            <CheckCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white/75" />
          )}
        </div>
      </div>
    </div>
  );
}
