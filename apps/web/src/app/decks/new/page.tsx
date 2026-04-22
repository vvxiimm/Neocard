'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/game/Card';
import { MainNav } from '@/components/layout/MainNav';
import { apiClient } from '@/lib/api';
import { GAME_CONSTANTS } from '@nexus/shared';
import { useRouter } from 'next/navigation';

export default function DeckBuilderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deckName, setDeckName] = useState('New Deck');
  const [selectedCards, setSelectedCards] = useState<Map<string, number>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');

  const { data: collection } = useQuery({
    queryKey: ['collection'],
    queryFn: async () => {
      const response = await apiClient.get('/cards/collection');
      return response.data;
    },
  });

  const saveDeckMutation = useMutation({
    mutationFn: async () => {
      const cards = Array.from(selectedCards.entries()).map(([cardId, count]) => ({
        cardDefinitionId: cardId,
        count,
      }));

      await apiClient.post('/decks', {
        name: deckName,
        cards,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      router.push('/decks');
    },
  });

  const totalCards = Array.from(selectedCards.values()).reduce((sum, count) => sum + count, 0);
  const isValidDeck = totalCards === GAME_CONSTANTS.DECK_SIZE;

  const addCard = (cardId: string) => {
    const current = selectedCards.get(cardId) || 0;
    if (current < 2 && totalCards < GAME_CONSTANTS.DECK_SIZE) {
      const newMap = new Map(selectedCards);
      newMap.set(cardId, current + 1);
      setSelectedCards(newMap);
    }
  };

  const removeCard = (cardId: string) => {
    const current = selectedCards.get(cardId) || 0;
    if (current > 0) {
      const newMap = new Map(selectedCards);
      if (current === 1) {
        newMap.delete(cardId);
      } else {
        newMap.set(cardId, current - 1);
      }
      setSelectedCards(newMap);
    }
  };

  const filteredCollection = collection?.filter((userCard: any) => {
    if (searchQuery) {
      return userCard.cardDefinition.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deck Area */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6 sticky top-4">
              <h2 className="text-2xl font-orbitron text-gradient mb-4">Your Deck</h2>

              {/* Deck Name */}
              <input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-primary"
                placeholder="Deck name..."
              />

              {/* Card Count */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Cards</span>
                  <span className={totalCards === GAME_CONSTANTS.DECK_SIZE ? 'text-green-400' : 'text-yellow-400'}>
                    {totalCards} / {GAME_CONSTANTS.DECK_SIZE}
                  </span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      isValidDeck ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalCards / GAME_CONSTANTS.DECK_SIZE) * 100}%` }}
                  />
                </div>
              </div>

              {/* Selected Cards List */}
              <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {Array.from(selectedCards.entries()).map(([cardId, count]) => {
                    const userCard = collection?.find(
                      (uc: any) => uc.cardDefinitionId === cardId
                    );
                    if (!userCard) return null;

                    return (
                      <motion.div
                        key={cardId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="glass rounded-lg p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {userCard.cardDefinition.cost}
                          </div>
                          <div>
                            <div className="font-bold text-sm">
                              {userCard.cardDefinition.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {count}x
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => removeCard(cardId)}
                            className="w-6 h-6 rounded bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400"
                          >
                            -
                          </button>
                          <button
                            onClick={() => addCard(cardId)}
                            className="w-6 h-6 rounded bg-green-500/20 hover:bg-green-500/40 flex items-center justify-center text-green-400"
                            disabled={count >= 2}
                          >
                            +
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Save Button */}
              <button
                onClick={() => saveDeckMutation.mutate()}
                disabled={!isValidDeck || saveDeckMutation.isPending}
                className={`w-full py-3 rounded-lg font-orbitron font-bold transition ${
                  isValidDeck
                    ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-80'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                {saveDeckMutation.isPending ? 'Saving...' : 'Save Deck'}
              </button>

              {!isValidDeck && (
                <p className="text-xs text-yellow-400 mt-2 text-center">
                  Add {GAME_CONSTANTS.DECK_SIZE - totalCards} more cards
                </p>
              )}
            </div>
          </div>

          {/* Collection Area */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-orbitron text-gradient mb-4">
                Card Collection
              </h2>

              {/* Search */}
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCollection?.map((userCard: any) => (
                <motion.div
                  key={userCard.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => addCard(userCard.cardDefinitionId)}
                  className="cursor-pointer"
                >
                  <Card card={userCard.cardDefinition} size="small" />
                  <div className="mt-2 text-center text-xs text-gray-400">
                    Owned: {userCard.count}x
                    {selectedCards.has(userCard.cardDefinitionId) && (
                      <span className="text-primary ml-2">
                        (In deck: {selectedCards.get(userCard.cardDefinitionId)}x)
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
