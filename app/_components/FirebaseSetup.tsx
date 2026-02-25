'use client';

import { useEffect } from 'react';
import { useAuth } from '@/app/_context/AuthContext';
import { useNotification } from '@/app/_context/NotificationContext';
import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';

// Firebase configuration - get from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let messaging: ReturnType<typeof getMessaging> | null = null;

export function FirebaseSetup() {
  const { user } = useAuth();
  const { registerPushToken } = useNotification();

  useEffect(() => {
    if (!user) return;

    // Check if Firebase config is complete
    const isFirebaseConfigured = 
      firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId;

    if (!isFirebaseConfigured) {
      console.warn('[Firebase] Configuration incomplete - Push notifications disabled');
      console.warn('[Firebase] Please set NEXT_PUBLIC_FIREBASE_* environment variables');
      return;
    }

    try {
      // Initialize Firebase only on client side
      if (typeof window !== 'undefined' && !messaging) {
        const app = initializeApp(firebaseConfig);
        messaging = getMessaging(app);

        // Request notification permission
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted' && messaging) {
            // Get FCM token
            getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            })
              .then((token) => {
                if (token) {
                  // Register token with backend
                  registerPushToken(token);
                }
              })
              .catch((err) => console.error('FCM token error:', err));

            // Listen for foreground messages
            onMessage(messaging, (payload) => {
              console.log('Message received:', payload);
              // Show in-app notification
              if (payload.notification) {
                new Notification(payload.notification.title || 'TripMates', {
                  body: payload.notification.body,
                  icon: '/favicon.ico',
                });
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Firebase setup error:', error);
    }
  }, [user, registerPushToken]);

  return null;
}
