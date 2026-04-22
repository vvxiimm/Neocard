'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import WebApp from '@twa-dev/sdk';
import { apiClient } from '@/lib/api';

export function useTelegramAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const { setAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const authenticate = async () => {
      try {
        // Initialize Telegram WebApp
        WebApp.ready();
        WebApp.expand();

        // Get initData from Telegram
        const initData = WebApp.initData;

        if (!initData) {
          console.warn('No Telegram initData available');
          setIsLoading(false);
          return;
        }

        // Authenticate with backend
        const response = await apiClient.post('/auth/telegram', { initData });
        const { accessToken, user } = response.data;

        setAuth(user, accessToken);
      } catch (error) {
        console.error('Authentication failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthenticated) {
      authenticate();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, setAuth]);

  return { isAuthenticated, isLoading };
}
