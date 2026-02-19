export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL!,
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  },
};
