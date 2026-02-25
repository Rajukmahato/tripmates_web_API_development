'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { Message, Conversation } from '@/app/_types/common.types';
import { useAuth } from './AuthContext';
import { getAuthToken } from '@/app/_utils/cookies';
import { 
  connectSocket, 
  disconnectSocket, 
  onReceiveMessage, 
  emitSendMessage,
  isSocketConnected
} from '@/lib/websocket/socket';
import { buildCacheKey, getCached, setCached } from '@/app/_utils/client-cache';
import {
  getConversations,
  getMessages,
  sendMessage as sendMessageApi,
  markAsRead as markAsReadAPI,
} from '@/lib/api/chat';

interface ChatContextType {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  selectedUserId: string | null;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  error: string | null;
  
  // Actions
  fetchConversations: () => Promise<void>;
  fetchMessages: (userId: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  markAsRead: (userId: string) => Promise<void>;
  setSelectedUserId: (userId: string | null) => void;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheTtlMs = 60_000;

  useEffect(() => {
    if (!user?._id) {
      setConversations([]);
      setMessages({});
      return;
    }

    const cachedConversations = getCached<Conversation[]>(
      buildCacheKey('chat:conversations', user._id)
    );

    if (cachedConversations?.length) {
      setConversations(cachedConversations);
    }
  }, [user]);

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initSocket = async () => {
      if (user) {
        try {
          const token = await getAuthToken();
          if (token) {
            connectSocket(token);
            cleanup = onReceiveMessage((data: unknown) => {
              const message = data as Message;
              const senderId = message.sender?._id;
              if (!senderId) return;

              setMessages((prev) => {
                const updated = {
                  ...prev,
                  [senderId]: [...(prev[senderId] || []), message],
                };

                if (user?._id) {
                  setCached(
                    buildCacheKey('chat:messages', user._id, senderId),
                    updated[senderId],
                    cacheTtlMs
                  );
                }

                return updated;
              });

              // Update conversation last message
              setConversations((prev) => {
                const updatedConversations = prev.map((conv) =>
                  conv.participant._id === senderId
                    ? { ...conv, lastMessage: message, unreadCount: (conv.unreadCount ?? 0) + 1 }
                    : conv
                );

                if (user?._id) {
                  setCached(
                    buildCacheKey('chat:conversations', user._id),
                    updatedConversations,
                    cacheTtlMs
                  );
                }

                return updatedConversations;
              });
            });
          }
        } catch (err) {
          console.error('Failed to initialize socket:', err);
          console.warn('Chat will work via REST API without real-time updates');
          // Don't set error - chat still works via REST API
        }
      } else {
        disconnectSocket();
      }
    };

    initSocket();

    return () => {
      cleanup?.();
    };
  }, [user]);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingConversations(true);
    setError(null);
    
    try {
      const response = await getConversations();
      // Extract conversations from response data
      const normalized = Array.isArray(response?.data) 
        ? response.data 
        : [];
      setConversations(normalized);
      if (user?._id) {
        setCached(buildCacheKey('chat:conversations', user._id), normalized, cacheTtlMs);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError('Failed to load conversations');
      setConversations([]);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (userId: string) => {
    if (!user) return;
    
    setIsLoadingMessages(true);
    setError(null);

    if (user?._id) {
      const cached = getCached<Message[]>(buildCacheKey('chat:messages', user._id, userId));
      if (cached?.length) {
        setMessages((prev) => ({
          ...prev,
          [userId]: cached,
        }));
      }
    }
    
    try {
      const response = await getMessages(userId);
      // Extract messages from response data
      const messagesArray = Array.isArray(response?.data) 
        ? response.data 
        : [];
      setMessages((prev) => ({
        ...prev,
        [userId]: messagesArray,
      }));

      if (user?._id) {
        setCached(buildCacheKey('chat:messages', user._id, userId), messagesArray, cacheTtlMs);
      }
      
      // Mark messages as read when opening conversation
      await markAsReadAPI(userId);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [user]);

  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    if (!user || !content.trim()) return;

    const trimmed = content.trim();
    const useSocket = isSocketConnected();
    const receiverUser = conversations.find((conv) => conv.participant._id === receiverId)?.participant;

    // Optimistically add message to local state
    const newMessage: Message = {
      _id: `temp-${Date.now()}`,
      sender: user,
      receiver: receiverUser,
      content: trimmed,
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages((prev) => {
      const updated = [...(prev[receiverId] || []), newMessage];

      if (user?._id) {
        setCached(buildCacheKey('chat:messages', user._id, receiverId), updated, cacheTtlMs);
      }

      return {
        ...prev,
        [receiverId]: updated,
      };
    });

    setConversations((prev) => {
      const updatedConversations = prev.map((conv) =>
        conv.participant._id === receiverId
          ? { ...conv, lastMessage: newMessage }
          : conv
      );

      if (user?._id) {
        setCached(buildCacheKey('chat:conversations', user._id), updatedConversations, cacheTtlMs);
      }

      return updatedConversations;
    });

    if (useSocket) {
      emitSendMessage(receiverId, trimmed);
      return;
    }

    try {
      const savedMessage = await sendMessageApi(receiverId, trimmed);
      setMessages((prev) => {
        const updated = [...(prev[receiverId] || []).filter((msg) => msg._id !== newMessage._id), savedMessage];

        if (user?._id) {
          setCached(buildCacheKey('chat:messages', user._id, receiverId), updated, cacheTtlMs);
        }

        return {
          ...prev,
          [receiverId]: updated,
        };
      });

      setConversations((prev) => {
        const updatedConversations = prev.map((conv) =>
          conv.participant._id === receiverId
            ? { ...conv, lastMessage: savedMessage }
            : conv
        );

        if (user?._id) {
          setCached(buildCacheKey('chat:conversations', user._id), updatedConversations, cacheTtlMs);
        }

        return updatedConversations;
      });
    } catch (err) {
      console.error('Failed to send message via REST:', err);
      setError('Failed to send message');
    }
  }, [user, conversations]);

  const markAsRead = useCallback(async (userId: string) => {
    try {
      await markAsReadAPI(userId);
      
      // Update conversation unread count
      setConversations((prev) =>
        prev.map((conv) =>
          conv.participant._id === userId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: ChatContextType = {
    conversations,
    messages,
    selectedUserId,
    isLoadingConversations,
    isLoadingMessages,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead,
    setSelectedUserId,
    clearError,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
