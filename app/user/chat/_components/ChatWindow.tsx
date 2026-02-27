'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Message } from '@/app/_types/common.types';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Avatar } from '@/app/_components/ui/avatar';
import { Send, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';

interface ChatWindowProps {
  selectedUser: User;
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
  onSendMessage: (content: string) => void | Promise<void>;
}

export function ChatWindow({
  selectedUser,
  messages,
  currentUserId,
  isLoading,
  onSendMessage,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageContent, setMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!messageContent.trim() || isSending) return;

    setIsSending(true);
    try {
      onSendMessage(messageContent);
      setMessageContent('');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950">
      {/* Header - hidden on mobile, shown on desktop */}
      <div className="hidden lg:flex flex-shrink-0 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 xl:px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
            {/* Back button */}
            <Link href="/user/chat">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 xl:h-9 xl:w-9 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 flex-shrink-0"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="h-4 w-4 xl:h-4.5 xl:w-4.5" />
              </Button>
            </Link>
            
            <Avatar 
              name={selectedUser.fullName}
              profileImagePath={
                selectedUser.profileImagePath || selectedUser.profileImage
              }
              className="h-9 w-9 xl:h-10 xl:w-10 ring-2 ring-blue-100 dark:ring-blue-900 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm xl:text-base font-bold text-gray-900 dark:text-white truncate">
                {selectedUser.fullName}
              </h2>
              <p className="text-[11px] xl:text-xs text-green-600 dark:text-green-400 font-medium">
                Active now
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 lg:gap-1 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 xl:h-9 xl:w-9 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
              aria-label="Voice call"
            >
              <Phone className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 xl:h-9 xl:w-9 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
              aria-label="Video call"
            >
              <Video className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 xl:h-9 xl:w-9 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
              aria-label="More options"
            >
              <MoreVertical className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600"></div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 sm:gap-4 text-center px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Send className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-1 sm:space-y-2 max-w-sm">
              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                No messages yet
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Start the conversation by sending a message below!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={String(message.sender._id) === String(currentUserId)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 sm:px-4 lg:px-6 xl:px-8 py-2.5 sm:py-3 lg:py-4 safe-area-inset-bottom">
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          <Input
            type="text"
            placeholder="Type a message..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
            className="flex-1 h-10 sm:h-11 px-4 text-sm sm:text-base bg-gray-100 dark:bg-slate-700 border-0 rounded-full focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            aria-label="Message input"
          />
          <Button
            onClick={handleSend}
            disabled={isSending || !messageContent.trim()}
            size="default"
            className="h-10 w-10 sm:h-11 sm:w-11 p-0 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex-shrink-0"
            aria-label="Send message"
          >
            {isSending ? (
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
            ) : (
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
