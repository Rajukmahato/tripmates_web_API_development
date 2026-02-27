import { apiClient } from '@/lib/api/axios';
import { Message, Conversation } from '@/app/_types/common.types';

export interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface MessagesResponse {
  success: boolean;
  data: Message[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function getConversations(page = 1, limit = 20): Promise<ConversationsResponse> {
  try {
    const response = await apiClient.get(`/api/chat/conversations?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
}

export async function ensureConversation(participantId: string): Promise<void> { 
  try {
    await apiClient.post('/api/chat/conversations/ensure', { participantId });
  } catch (error: any) {
    // E11000 error means the conversation already exists, which is fine
    if (error?.message?.includes('E11000') || error?.response?.status === 409) {
      console.log('Conversation already exists');
      return;
    }
    console.error('Error ensuring conversation:', error);
    throw error;
  }
}

export async function getMessages(userId: string, page = 1, limit = 50): Promise<MessagesResponse> {
  try {
    const response = await apiClient.get(`/api/chat/messages/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

export async function sendMessage(
  receiverId: string,
  content: string
): Promise<Message> {
  try {
    const response = await apiClient.post('/api/chat/messages', {
      receiverId,
      content,
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function markAsRead(userId: string): Promise<void> {
  try {
    await apiClient.put(`/api/chat/messages/${userId}/read`);
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
}

// ============================================
// v2: GROUP CHAT APIs
// ============================================

export interface GroupChat {
  _id: string;
  groupChatId: string;
  trip: {
    _id: string;
    title: string;
    [key: string]: unknown;
  } | string;
  members: string[];
  lastMessage?: Message;
  lastMessageAt?: string;
  messageCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupChatsResponse {
  success: boolean;
  data: {
    groupChats: GroupChat[];
    total: number;
    pages: number;
    currentPage: number;
  };
}

export async function getGroupChatsForUser(page = 1, limit = 20): Promise<GroupChatsResponse> {
  try {
    const response = await apiClient.get(`/api/chat/groups?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching group chats:', error);
    throw error;
  }
}

export async function createGroupChat(tripId: string): Promise<GroupChat> {
  try {
    const response = await apiClient.post('/api/chat/groups', { tripId });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error creating group chat:', error);
    throw error;
  }
}

export async function getGroupChat(tripId: string): Promise<GroupChat> {
  try {
    const response = await apiClient.get(`/api/chat/groups/${tripId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching group chat:', error);
    throw error;
  }
}

export async function getGroupChatByGroupId(groupChatId: string): Promise<GroupChat> {
  try {
    const response = await apiClient.get(`/api/chat/groups/chat/${groupChatId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching group chat by ID:', error);
    throw error;
  }
}

export async function getGroupMessages(groupId: string): Promise<Message[]> {
  try {
    const response = await apiClient.get(`/api/chat/groups/${groupId}/messages`);
    const data = response.data.data || response.data;
    
    // API returns { messages, total, pages, currentPage }
    // Extract just the messages array
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.messages)) {
      return data.messages;
    }
    return [];
  } catch (error) {
    console.error('Error fetching group messages:', error);
    throw error;
  }
}

export async function sendGroupMessage(
  groupId: string,
  content: string
): Promise<Message> {
  try {
    const response = await apiClient.post(`/api/chat/groups/${groupId}/messages`, {
      content,
    });
    // API returns { success, message, data: Message }
    const data = response.data.data || response.data;
    if (typeof data === 'object' && data._id) {
      return data as Message;
    }
    throw new Error('Invalid message response from server');
  } catch (error) {
    console.error('Error sending group message:', error);
    throw error;
  }
}

/**
 * Get unread message count for current user
 */
export async function getUnreadMessageCount(): Promise<number> {
  try {
    const response = await apiClient.get('/api/chat/unread-count');
    const data = response.data.data || response.data;
    return typeof data === 'number' ? data : data.count || 0;
  } catch (error) {
    console.error('Error fetching unread message count:', error);
    throw error;
  }
}

/**
 * Add a member to group chat
 */
export async function addGroupMember(groupId: string, userId: string): Promise<void> {
  try {
    await apiClient.post(`/api/chat/groups/${groupId}/members`, { userId });
  } catch (error) {
    console.error('Error adding group member:', error);
    throw error;
  }
}

/**
 * Remove a member from group chat
 */
export async function removeGroupMember(groupId: string, userId: string): Promise<void> {
  try {
    await apiClient.delete(`/api/chat/groups/${groupId}/members/${userId}`);
  } catch (error) {
    console.error('Error removing group member:', error);
    throw error;
  }
}