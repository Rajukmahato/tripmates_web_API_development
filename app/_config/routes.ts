export const routes = {
  public: {
    home: '/',
    about: '/about',
    destinations: '/destinations',
  },
  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forget-password',
    resetPassword: '/reset-password',
  },
  user: {
    dashboard: '/user/dashboard',
    profile: '/user/profile',
    trips: '/user/trips',
    chat: '/user/chat',
    notifications: '/user/notifications',
    reviews: '/user/reviews',
  },
  admin: {
    dashboard: '/admin',
    users: '/admin/users',
    trips: '/admin/trips',
    destinations: '/admin/destinations',
    reports: '/admin/reports',
    reviews: '/admin/reviews',
    analytics: '/admin/analytics',
  },
  requests: {
    received: '/user/requests/received',
    sent: '/user/requests/sent',
  },
};
