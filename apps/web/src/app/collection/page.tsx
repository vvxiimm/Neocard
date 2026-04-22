'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card } from '@/components/game/Card';
import { MainNav } from '@/components/layout/MainNav';
import { apiClient } from '@/lib/api';
import { CardRarity, CardType, Faction } from '@nexus/shared';

export default function CollectionPage() {
  const [selectedRarity, setSelectedRarity] = useState<CardRarity | 'ALL'>('ALL');
  const [selectedFaction, setSelectedFaction] = useState<Faction | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: collection, isLoading } = useQuery({
    queryKey: ['collection'],
    queryFn: async () => {
      const response = await apiClient.get('/cards/collection');
      return response.data;
    },
  });

  const filteredCards = collection?.filter((userCard: any) => {
    const card = userCard.cardDefinition;
    if (selectedRarity !== 'ALL' && card.rarity !== selectedRarity) return false;
    if (selectedFaction !== 'ALL' && card.faction !== selectedFaction) return false;
    if (searchQuery && !card.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const rarities = ['ALL', ...Object.values(CardRarity)];
  const factions = ['ALL', ...Object.values(Faction)];

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-orbitron text-gradient mb-2">Card Collection</h1>
          <p className="text-gray-400">
            {collection?.length || 0} cards collected
          </p>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Search</label>
              <input
                type="text"
                placeholder="Card name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Rarity Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Rarity</label>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value as any)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              >
                {rarities.map((rarity) => (
                  <option key={rarity} value={rarity}>
                    {rarity}
                  </option>
                ))}
              </select>
            </div>

            {/* Faction Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Faction</label>
              <select
                value={selectedFaction}
                onChange={(e) => setSelectedFaction(e.target.value as any)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              >
                {factions.map((faction) => (
                  <option key={faction} value={faction}>
                    {faction}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🎴</div>
            <div className="text-xl text-gray-400">Loading collection...</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredCards?.map((userCard: any, index: number) => (
              <motion.div
                key={userCard.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card card={userCard.cardDefinition} size="small" />
                <div className="mt-2 text-center">
                  <div className="text-xs text-gray-400">
                    Owned: {userCard.count}x
                  </div>
                  {userCard.isGolden && (
                    <div className="text-xs text-yellow-400">✨ Golden</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredCards?.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-xl text-gray-400">No cards found</div>
          </div>
        )}
      </div>
    </div>
  );
}
