import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5050';

type PendingEmit = {
  event: string;
  payload: unknown;
};

let socket: Socket | null = null;
let lastToken: string | null = null;
let pendingEmits: PendingEmit[] = [];
let listenersInitialized = false;

const flushPendingEmits = () => {
  if (!socket?.connected || pendingEmits.length === 0) return;

  pendingEmits.forEach(({ event, payload }) => {
    socket?.emit(event, payload);
  });
  pendingEmits = [];
};

const setupSocketListeners = () => {
  if (!socket || listenersInitialized) return;

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id);
    flushPendingEmits();
  });

  socket.on('connect_error', (error: any) => {
    console.error('[Socket] Connection Error:', error);
    console.warn('[Socket] If backend is not running, chat functionality will be limited. Messages will still work via REST API.');
  });

  socket.on('error', (error: any) => {
    console.error('[Socket] Socket Error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('pong', () => {
    console.log('[Socket] Pong received');
  });

  listenersInitialized = true;
};

export const connectSocket = (token: string): Socket => {
  if (socket) {
    if (token !== lastToken) {
      socket.auth = { token };
      lastToken = token;
    }

    if (!socket.connected) {
      socket.connect();
    }

    return socket;
  }

  console.log('[Socket] Connecting to:', SOCKET_URL);

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    timeout: 10000,
  });

  lastToken = token;
  setupSocketListeners();

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    lastToken = null;
    pendingEmits = [];
    listenersInitialized = false;
  }
};

export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};

const emitEvent = (event: string, payload: unknown) => {
  if (socket?.connected) {
    socket.emit(event, payload);
    return;
  }

  pendingEmits.push({ event, payload });
};

// Emit events
export const emitSendMessage = (receiverId: string, content: string) => {
  emitEvent('sendMessage', { receiverId, content });
};

// ============================================
// GROUP CHAT EVENTS (v2)
// ============================================

export const joinGroup = (groupId: string) => {
  emitEvent('joinGroup', { groupId });
};

export const leaveGroup = (groupId: string) => {
  emitEvent('leaveGroup', { groupId });
};

export const sendGroupMessage = (groupId: string, content: string) => {
  emitEvent('sendGroupMessage', { groupId, content });
};

export const onReceiveGroupMessage = (callback: (data: unknown) => void) => {
  if (!socket) return () => undefined;
  socket.on('receiveGroupMessage', callback);
  return () => {
    socket?.off('receiveGroupMessage', callback);
  };
};

export const offReceiveGroupMessage = (callback?: (data: unknown) => void) => {
  if (!socket) return;
  if (callback) {
    socket.off('receiveGroupMessage', callback);
    return;
  }
  socket.off('receiveGroupMessage');
};



// Listen for events (to be called in components)
export const onReceiveMessage = (callback: (data: unknown) => void) => {
  if (!socket) return () => undefined;
  socket.on('receiveMessage', callback);
  return () => {
    socket?.off('receiveMessage', callback);
  };
};

export const onMessageRead = (callback: (data: unknown) => void) => {
  if (!socket) return () => undefined;
  socket.on('messageRead', callback);
  return () => {
    socket?.off('messageRead', callback);
  };
};

export const offReceiveMessage = (callback?: (data: unknown) => void) => {
  if (!socket) return;
  if (callback) {
    socket.off('receiveMessage', callback);
    return;
  }
  socket.off('receiveMessage');
};

export const offMessageRead = (callback?: (data: unknown) => void) => {
  if (!socket) return;
  if (callback) {
    socket.off('messageRead', callback);
    return;
  }
  socket.off('messageRead');
};
