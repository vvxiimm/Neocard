'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useTelegramAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/lobby');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-orbitron text-gradient">Loading Nexus Cards...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-6xl font-orbitron text-gradient mb-4">
          NEXUS CARDS
        </h1>
        <p className="text-xl text-gray-300">
          Premium Card Battler
        </p>
        <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto" />
      </div>
    </div>
  );
}
