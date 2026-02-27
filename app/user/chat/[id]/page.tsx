'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useChat } from '@/app/_context/ChatContext';
import { useAuth } from '@/app/_context/AuthContext';
import { ChatWindow } from '@/app/user/chat/_components/ChatWindow';
import { Button } from '@/app/_components/ui/button';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { getUserProfile } from '@/lib/api/user';
import { ensureConversation } from '@/lib/api/chat';
import { User } from '@/app/_types/common.types';

export default function ChatThreadPage() {
  const params = useParams();
  const userId = params.id as string;
  const { user } = useAuth();
  const { 
    messages, 
    fetchMessages, 
    sendMessage, 
    isLoadingMessages,
    isLoadingConversations,
    conversations,
    fetchConversations
  } = useChat();
  const [fallbackUser, setFallbackUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch conversations to get user data
      fetchConversations();
    }
  }, [user, fetchConversations]);

  useEffect(() => {
    if (userId) {
      // Fetch messages
      fetchMessages(userId);
    }
  }, [userId, fetchMessages]);

  useEffect(() => {
    if (!userId || !user) return;

    ensureConversation(userId).catch((error) => {
      console.error('Failed to ensure conversation:', error);
    });
  }, [userId, user]);

  // Find the conversation with this user and extract their data
  const selectedUser = userId && conversations.length > 0
    ? conversations.find((conv) => conv.participant && conv.participant._id === userId)?.participant || null
    : null;

  const activeUser = useMemo(() => selectedUser || fallbackUser, [selectedUser, fallbackUser]);

  useEffect(() => {
    if (!userId || selectedUser || !user) return;

    const loadUser = async () => {
      setIsLoadingUser(true);
      try {
        const response = await getUserProfile(userId);
        setFallbackUser(response.data || null);
      } catch (error) {
        console.error('Failed to load chat user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, [userId, selectedUser, user]);

  if (isLoadingConversations || isLoadingUser || !user) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-slate-900">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600"></div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Loading conversation...</p>
        </div>
      </div>
    );
  }

  // If conversation doesn't exist, show a message
  if (!activeUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-slate-900 gap-4 sm:gap-6 p-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600 dark:text-red-400" />
        </div>
        <div className="text-center space-y-2 sm:space-y-3 max-w-md px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">No conversation found</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            This conversation doesn&apos;t exist yet. Connect with them first!
          </p>
          <Link href="/user/chat" className="inline-block mt-2 sm:mt-4">
            <Button variant="outline" size="default" className="gap-2 font-semibold text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4" />
              Back to Messages
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const userMessages = messages[userId] || [];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Header with back button - only show on mobile */}
      <div className="lg:hidden flex-shrink-0 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 shadow-sm">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link href="/user/chat">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate flex-1">
            {activeUser.fullName}
          </h1>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          selectedUser={activeUser}
          messages={userMessages}
          currentUserId={user?._id || ''}
          isLoading={isLoadingMessages}
          onSendMessage={(content) => sendMessage(userId, content)}
        />
      </div>
    </div>
  );
}
