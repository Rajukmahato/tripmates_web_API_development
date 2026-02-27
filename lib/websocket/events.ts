export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Message events
  MESSAGE_SENT: 'message:sent',
  MESSAGE_RECEIVED: 'message:received',
  MESSAGE_READ: 'message:read',
  TYPING_START: 'typing:start',
  TYPING_END: 'typing:end',

  // Notification events
  NOTIFICATION_RECEIVED: 'notification:received',
  NOTIFICATION_READ: 'notification:read',

  // Trip events
  TRIP_UPDATED: 'trip:updated',
  TRIP_MEMBER_JOINED: 'trip:member:joined',
  TRIP_MEMBER_LEFT: 'trip:member:left',

  // Partner request events
  REQUEST_RECEIVED: 'request:received',
  REQUEST_ACCEPTED: 'request:accepted',
  REQUEST_REJECTED: 'request:rejected',
  REQUEST_CANCELLED: 'request:cancelled',
};
