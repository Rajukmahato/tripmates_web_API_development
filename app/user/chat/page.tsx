'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useChat } from '@/app/_context/ChatContext';
import { useAuth } from '@/app/_context/AuthContext';
import { ConversationList, ChatListItem } from '@/app/user/chat/_components/ConversationList';
import { Button } from '@/app/_components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getGroupChatsForUser, GroupChat } from '@/lib/api/chat';

export default function ChatPage() {
  const { user } = useAuth();
  const { 
    conversations, 
    fetchConversations, 
    isLoadingConversations,
    selectedUserId 
  } = useChat();
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [isLoadingGroupChats, setIsLoadingGroupChats] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  useEffect(() => {
    if (!user) return;

    const loadGroupChats = async () => {
      setIsLoadingGroupChats(true);
      try {
        const response = await getGroupChatsForUser();
        const chats = Array.isArray(response?.data?.groupChats)
          ? response.data.groupChats
          : [];
        setGroupChats(chats);
      } catch (error) {
        console.error('Failed to fetch group chats:', error);
        setGroupChats([]);
      } finally {
        setIsLoadingGroupChats(false);
      }
    };

    loadGroupChats();
  }, [user]);

  const displayConversations = useMemo(() => {
    const directItems: ChatListItem[] = conversations
      .filter((conversation) => conversation.participant && conversation.participant._id)
      .map((conversation) => ({
        id: conversation._id,
        type: 'private',
        title: conversation.participant.fullName,
        href: `/user/chat/${conversation.participant._id}`,
        avatarName: conversation.participant.fullName,
        avatarImagePath:
          conversation.participant.profileImagePath ||
          conversation.participant.profileImage ||
          null,
        lastMessage: conversation.lastMessage
          ? {
              content: conversation.lastMessage.content,
              createdAt: conversation.lastMessage.createdAt,
            }
          : undefined,
        unreadCount: conversation.unreadCount,
        isSelected: selectedUserId === conversation.participant._id,
      }));

    const groupItems: ChatListItem[] = groupChats.map((groupChat) => {
      const trip = typeof groupChat.trip === 'object' ? groupChat.trip : null;
      const title = trip && typeof trip === 'object'
        ? (trip as { destination?: string }).destination || 'Trip Group'
        : 'Trip Group';
      const tripImage =
        trip && typeof trip === 'object'
          ? (trip as { images?: string[]; image?: string | null }).images?.[0] ||
            (trip as { image?: string | null }).image ||
            null
          : null;

      return {
        id: groupChat.groupChatId,
        type: 'group',
        title,
        href: `/user/chat/group/${groupChat.groupChatId}`,
        tripImage,
        lastMessage: groupChat.lastMessage
          ? {
              content: groupChat.lastMessage.content,
              createdAt: groupChat.lastMessage.createdAt,
            }
          : groupChat.lastMessageAt
          ? {
              content: 'New activity in group',
              createdAt: groupChat.lastMessageAt,
            }
          : undefined,
        unreadCount: 0,
      };
    });

    const combined = [...directItems, ...groupItems];
    combined.sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return combined;
  }, [conversations, groupChats, selectedUserId]);

  // If a conversation is selected, redirect to that chat thread
  if (selectedUserId) {
    return null; // The routing will be handled by the router
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4">
          {/* Back button - visible on mobile, hidden on desktop as it's in main nav */}
          <Link href="/user/dashboard" className="lg:hidden flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          
          {/* Header content */}
          <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">Messages</h1>
            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium truncate">
              {displayConversations.length} {displayConversations.length === 1 ? 'conversation' : 'conversations'}
            </p>
          </div>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <ConversationList
          conversations={displayConversations}
          isLoading={isLoadingConversations || isLoadingGroupChats}
        />
      </div>
    </div>
  );
}
