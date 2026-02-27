'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getGroupChatByGroupId, getGroupMessages, sendGroupMessage } from '@/lib/api/chat';
import { getTripById, Trip } from '@/lib/api/trips';
import { useAuth } from '@/app/_context/AuthContext';
import { Message } from '@/app/_types/common.types';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Avatar } from '@/app/_components/ui/avatar';
import { ArrowLeft, Send } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { getProfileImageUrl } from '@/app/_utils/cn';

export default function GroupChatPage() {
  const params = useParams();
  const router = useRouter();
  const groupChatId = params.groupChatId as string;
  const { user: currentUser } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  // Fetch trip and messages
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        if (!groupChatId) {
          throw new Error('No group chat ID provided');
        }

        // Fetch GroupChat to get the trip reference
        console.log('Fetching GroupChat by groupChatId:', groupChatId);
        const groupChat = await getGroupChatByGroupId(groupChatId);
        console.log('GroupChat:', groupChat);

        // Extract tripId from the groupChat
        const tripId = typeof groupChat.trip === 'object' ? groupChat.trip._id : groupChat.trip;
        if (!tripId) {
          throw new Error('Trip ID not found in group chat data');
        }

        console.log('Fetching trip by tripId:', tripId);
        const tripResponse = await getTripById(tripId);
        setTrip(tripResponse.data);

        // Fetch messages
        const messagesData = await getGroupMessages(groupChatId);
        // Ensure messagesData is always an array
        const messagesArray = Array.isArray(messagesData) ? messagesData : [];
        setMessages(messagesArray);
      } catch (err) {
        console.error('Failed to load chat:', err);
        const message = err instanceof Error ? err.message : 'Failed to load group chat';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    if (groupChatId) {
      fetchData();
    }
  }, [groupChatId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentUser) return;

    const trimmedMessage = messageInput.trim();
    setMessageInput('');
    setIsSending(true);

    try {
      await sendGroupMessage(groupChatId, trimmedMessage);
      
      // Add message to local state immediately
      const newMessage: Message = {
        _id: Math.random().toString(),
        sender: currentUser,
        content: trimmedMessage,
        isRead: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
      
      // Scroll to bottom
      setTimeout(() => {
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 0);
    } catch (err) {
      console.error('Failed to send message:', err);
      const message = err instanceof Error ? err.message : 'Failed to send message';
      toast.error(message);
      setMessageInput(trimmedMessage); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-gray-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="text-center space-y-3">
          <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400"></div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">Loading group chat...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-50 to-white dark:from-slate-950 dark:to-slate-900 gap-3 sm:gap-4 p-4">
        <div className="text-center space-y-2 sm:space-y-3 max-w-md px-4">
          <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {error || 'Group chat not found'}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {error ? 'There was an error loading the chat.' : 'This trip group chat is not available.'}
          </p>
          <Link href="/user/chat" className="inline-block">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Messages
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="flex-shrink-0 sticky top-0 z-10 border-b border-gray-200 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all flex-shrink-0"
            aria-label="Go back to trip"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          </button>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
              {trip.destination}
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
              {trip.members?.length || 1} {trip.members?.length === 1 ? 'member' : 'members'} + owner
            </p>
          </div>
          
          <Link href={`/user/trips/${trip._id}`} className="flex-shrink-0">
            <Button variant="outline" size="sm" className="text-[11px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3">
              <span className="hidden xs:inline">Trip </span>Details
            </Button>
          </Link>
        </div>
      </div>

      {/* Messages Container */}
      <div
        id="messages-container"
        className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-4 py-4 sm:py-6 space-y-1 max-w-4xl mx-auto w-full bg-gradient-to-b from-gray-50/50 to-white dark:from-slate-900 dark:to-slate-950"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">No messages yet</p>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                Be the first to say something!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender._id === currentUser?._id;
            const time = new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            
            return (
              <div
                key={message._id}
                className={`flex items-end gap-1.5 sm:gap-2 mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {!isOwn && (
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                    {message.sender.profileImage ? (
                      <Image
                        src={getProfileImageUrl(message.sender.profileImage) || ''}
                        alt={message.sender.fullName}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-[10px] sm:text-xs font-bold text-white">
                        {message.sender.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Avatar>
                )}

                <div
                  className={`group relative max-w-[75%] sm:max-w-[70%] lg:max-w-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all ${
                    isOwn
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
                      : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-700 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {!isOwn && (
                    <p className="text-[10px] sm:text-xs font-semibold mb-0.5 sm:mb-1 opacity-75">
                      {message.sender.fullName}
                    </p>
                  )}
                  <p className="text-[13px] sm:text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div className={`flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <span
                      className={`text-[10px] sm:text-[11px] font-medium ${
                        isOwn ? 'text-white/75' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 sticky bottom-0 border-t border-gray-200 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 py-2.5 sm:py-3 safe-area-inset-bottom">
        <div className="flex items-center gap-2 sm:gap-3 max-w-4xl mx-auto">
          <Input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isSending}
            className="flex-1 h-10 sm:h-11 rounded-full bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base"
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || !messageInput.trim()}
            className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            aria-label="Send message"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
