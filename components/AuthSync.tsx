'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export function AuthSync() {
  useEffect(() => {
    // Create a broadcast channel for authentication events
    const authChannel = new BroadcastChannel('auth_sync');

    const handleMessage = async (event: MessageEvent) => {
      if (event.data === 'logout') {
        // 1. Explicitly sign out this tab's client-side session
        // This will update the internal NextAuth state and cookies
        await signOut({ 
          redirect: true, 
          callbackUrl: '/' 
        });
      }
    };

    authChannel.addEventListener('message', handleMessage);

    return () => {
      authChannel.removeEventListener('message', handleMessage);
      authChannel.close();
    };
  }, []);

  return null;
}
