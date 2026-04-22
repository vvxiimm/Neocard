'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/game/Card';
import { MainNav } from '@/components/layout/MainNav';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { CardRarity } from '@nexus/shared';

export default function PackOpeningPage() {
  const queryClient = useQueryClient();
  const [isOpening, setIsOpening] = useState(false);
  const [revealedCards, setRevealedCards] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const openPackMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/shop/open-pack', {
        packType: 'STANDARD',
      });
      return response.data;
    },
    onSuccess: (data) => {
      setRevealedCards(data.cards);
      setIsOpening(true);
      queryClient.invalidateQueries({ queryKey: ['collection'] });
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
    },
  });

  const handleOpenPack = () => {
    openPackMutation.mutate();
  };

  const handleNextCard = () => {
    if (currentCardIndex < revealedCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // All cards revealed
      setIsOpening(false);
      setRevealedCards([]);
      setCurrentCardIndex(0);
    }
  };

  const currentCard = revealedCards[currentCardIndex];

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        {!isOpening ? (
          /* Pack Selection Screen */
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-orbitron text-gradient mb-8 text-center">
              Open Card Packs
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Standard Pack */}
              <motion.div
                className="glass rounded-xl p-8 text-center cursor-pointer"
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={handleOpenPack}
              >
                <motion.div
                  className="text-8xl mb-4"
                  animate={{
                    rotateY: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  📦
                </motion.div>
                <h2 className="text-2xl font-orbitron mb-2">Standard Pack</h2>
                <p className="text-gray-400 mb-4">5 cards, 1 rare or better</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-cyan-400 text-2xl">₵</span>
                  <span className="text-3xl font-bold">100</span>
                </div>
                <button
                  className="w-full bg-gradient-to-r from-primary to-secondary py-3 rounded-lg font-orbitron font-bold hover:opacity-80 transition"
                  disabled={openPackMutation.isPending}
                >
                  {openPackMutation.isPending ? 'Opening...' : 'Open Pack'}
                </button>
              </motion.div>

              {/* Premium Pack */}
              <motion.div
                className="glass rounded-xl p-8 text-center opacity-50 cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-8xl mb-4">💎</div>
                <h2 className="text-2xl font-orbitron mb-2">Premium Pack</h2>
                <p className="text-gray-400 mb-4">5 cards, 1 legendary guaranteed</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-purple-400 text-2xl">◆</span>
                  <span className="text-3xl font-bold">200</span>
                </div>
                <button
                  className="w-full bg-gray-600 py-3 rounded-lg font-orbitron font-bold cursor-not-allowed"
                  disabled
                >
                  Coming Soon
                </button>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Card Reveal Screen */
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentCard && (
                <motion.div
                  key={currentCardIndex}
                  className="text-center"
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                >
                  {/* Rarity Announcement */}
                  <motion.div
                    className="text-6xl font-orbitron mb-8"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      color: getRarityColor(currentCard.rarity),
                      textShadow: `0 0 30px ${getRarityColor(currentCard.rarity)}`,
                    }}
                  >
                    {currentCard.rarity}
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card card={currentCard} size="large" showGlow />
                  </motion.div>

                  {/* Particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          background: getRarityColor(currentCard.rarity),
                          left: '50%',
                          top: '50%',
                        }}
                        animate={{
                          x: (Math.random() - 0.5) * 400,
                          y: (Math.random() - 0.5) * 400,
                          opacity: [1, 0],
                          scale: [1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: 0.5 + Math.random() * 0.5,
                        }}
                      />
                    ))}
                  </div>

                  {/* Progress */}
                  <motion.div
                    className="mt-8 text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Card {currentCardIndex + 1} of {revealedCards.length}
                  </motion.div>

                  {/* Next Button */}
                  <motion.button
                    className="mt-4 px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-orbitron font-bold"
                    onClick={handleNextCard}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentCardIndex < revealedCards.length - 1 ? 'Next Card' : 'Finish'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function getRarityColor(rarity: CardRarity): string {
  const colors = {
    [CardRarity.COMMON]: '#9E9E9E',
    [CardRarity.RARE]: '#2196F3',
    [CardRarity.EPIC]: '#9C27B0',
    [CardRarity.LEGENDARY]: '#FFD700',
    [CardRarity.MYTHIC]: '#FF00FF',
  };
  return colors[rarity] || '#FFFFFF';
}
