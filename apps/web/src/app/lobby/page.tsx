'use client';

import { useAuthStore } from '@/store/authStore';
import { MainNav } from '@/components/layout/MainNav';
import { GameModeCard } from '@/components/lobby/GameModeCard';
import { ProfileCard } from '@/components/lobby/ProfileCard';
import { CurrencyDisplay } from '@/components/common/CurrencyDisplay';

export default function LobbyPage() {
  const { user } = useAuthStore();

  const gameModes = [
    {
      id: 'classic',
      name: 'Classic Battle',
      description: 'Strategic 1v1 card battles',
      icon: '⚔️',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'fast',
      name: 'Fast Mode',
      description: 'Quick 3-minute matches',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'ranked',
      name: 'Ranked',
      description: 'Competitive ladder',
      icon: '🏆',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'poker',
      name: 'Poker Mode',
      description: 'Texas Hold\'em',
      icon: '🃏',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-orbitron text-gradient mb-2">
              Welcome, {user?.firstName || 'Player'}
            </h1>
            <p className="text-gray-400">Choose your game mode</p>
          </div>

          <CurrencyDisplay />
        </div>

        {/* Profile Card */}
        <ProfileCard />

        {/* Game Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {gameModes.map((mode) => (
            <GameModeCard key={mode.id} mode={mode} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="glass p-4 rounded-lg hover:bg-white/20 transition">
            <div className="text-2xl mb-2">📦</div>
            <div className="text-sm">Open Packs</div>
          </button>
          <button className="glass p-4 rounded-lg hover:bg-white/20 transition">
            <div className="text-2xl mb-2">🎴</div>
            <div className="text-sm">Collection</div>
          </button>
          <button className="glass p-4 rounded-lg hover:bg-white/20 transition">
            <div className="text-2xl mb-2">🛠️</div>
            <div className="text-sm">Deck Builder</div>
          </button>
          <button className="glass p-4 rounded-lg hover:bg-white/20 transition">
            <div className="text-2xl mb-2">🏪</div>
            <div className="text-sm">Shop</div>
          </button>
        </div>
      </div>
    </div>
  );
}
