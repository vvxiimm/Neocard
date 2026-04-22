'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/game/Card';
import { GameState, PlayerState, CardInstance, CardDefinition } from '@nexus/shared';
import { useGameStore } from '@/store/gameStore';

export default function BattlePage() {
  const { gameState, playCard, attack, endTurn } = useGameStore();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedAttacker, setSelectedAttacker] = useState<string | null>(null);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚔️</div>
          <h2 className="text-2xl font-orbitron">Loading Battle...</h2>
        </div>
      </div>
    );
  }

  const player = gameState.players.find((p) => p.userId === 'player1'); // TODO: use real user ID
  const opponent = gameState.players.find((p) => p.userId !== 'player1');

  if (!player || !opponent) return null;

  const isMyTurn = gameState.activePlayerId === player.userId;

  const handleCardClick = (cardInstanceId: string) => {
    if (!isMyTurn) return;
    setSelectedCard(cardInstanceId);
  };

  const handleBoardClick = () => {
    if (selectedCard) {
      playCard(selectedCard);
      setSelectedCard(null);
    }
  };

  const handleUnitClick = (unitId: string) => {
    if (!isMyTurn) return;

    if (selectedAttacker) {
      // Attack with selected unit
      attack(selectedAttacker, unitId);
      setSelectedAttacker(null);
    } else {
      // Select unit to attack
      const unit = player.board.find((u) => u.instanceId === unitId);
      if (unit && unit.canAttack) {
        setSelectedAttacker(unitId);
      }
    }
  };

  const handleNexusAttack = () => {
    if (selectedAttacker) {
      attack(selectedAttacker, 'nexus');
      setSelectedAttacker(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/20 to-black/40" />

      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Game Container */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Opponent Area */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Opponent Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="glass px-4 py-2 rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                👤
              </div>
              <div>
                <div className="text-sm font-bold">Opponent</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-400">❤️ {opponent.nexusHp}</span>
                  <span className="text-xs text-blue-400">⚡ {opponent.energy}/{opponent.maxEnergy}</span>
                </div>
              </div>
            </div>

            <div className="glass px-3 py-1 rounded-lg text-sm">
              <span className="text-gray-400">Cards:</span> {opponent.hand.length}
            </div>
          </div>

          {/* Opponent Hand (face down) */}
          <div className="flex justify-center gap-2 mb-4">
            {opponent.hand.map((_, index) => (
              <motion.div
                key={index}
                className="w-16 h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg border-2 border-gray-600"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              />
            ))}
          </div>

          {/* Opponent Board */}
          <div className="flex-1 glass rounded-xl p-4 flex items-center justify-center gap-4">
            <AnimatePresence>
              {opponent.board.map((unit) => (
                <motion.div
                  key={unit.instanceId}
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring' }}
                >
                  <Card
                    card={unit as any} // TODO: proper type
                    size="small"
                    isPlayable={false}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {opponent.board.length === 0 && (
              <div className="text-gray-500 text-sm">Empty Board</div>
            )}
          </div>
        </div>

        {/* Center Divider */}
        <div className="relative h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {/* Turn Indicator */}
          <motion.div
            className={`glass px-6 py-2 rounded-full font-orbitron font-bold ${
              isMyTurn ? 'text-primary glow-primary' : 'text-gray-400'
            }`}
            animate={{
              scale: isMyTurn ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: isMyTurn ? Infinity : 0,
            }}
          >
            {isMyTurn ? 'YOUR TURN' : 'OPPONENT TURN'}
          </motion.div>

          {/* Turn Counter */}
          <div className="absolute right-4 glass px-3 py-1 rounded-lg text-sm">
            Turn {gameState.currentTurn}
          </div>
        </div>

        {/* Player Area */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Player Board */}
          <div
            className="flex-1 glass rounded-xl p-4 flex items-center justify-center gap-4 mb-4 cursor-pointer"
            onClick={handleBoardClick}
          >
            <AnimatePresence>
              {player.board.map((unit) => (
                <motion.div
                  key={unit.instanceId}
                  initial={{ scale: 0, rotateY: 180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnitClick(unit.instanceId);
                  }}
                >
                  <Card
                    card={unit as any}
                    size="small"
                    isPlayable={unit.canAttack}
                    isSelected={selectedAttacker === unit.instanceId}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {player.board.length === 0 && (
              <div className="text-gray-500 text-sm">
                {selectedCard ? 'Click to play card here' : 'Your Board'}
              </div>
            )}
          </div>

          {/* Player Hand */}
          <div className="flex justify-center gap-3 mb-4 overflow-x-auto pb-2">
            <AnimatePresence>
              {player.hand.map((card, index) => (
                <motion.div
                  key={card.instanceId}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    card={card as any}
                    size="medium"
                    isPlayable={isMyTurn && player.energy >= (card as any).cost}
                    isSelected={selectedCard === card.instanceId}
                    onClick={() => handleCardClick(card.instanceId)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Player Info & Actions */}
          <div className="flex items-center justify-between">
            <div className="glass px-4 py-2 rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                👤
              </div>
              <div>
                <div className="text-sm font-bold">You</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-400">❤️ {player.nexusHp}</span>
                  <span className="text-xs text-cyan-400">⚡ {player.energy}/{player.maxEnergy}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {selectedAttacker && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="glass px-4 py-2 rounded-lg font-bold text-red-400 hover:bg-red-500/20 transition"
                  onClick={handleNexusAttack}
                >
                  Attack Nexus
                </motion.button>
              )}

              <motion.button
                className={`px-6 py-2 rounded-lg font-orbitron font-bold transition ${
                  isMyTurn
                    ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-80'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
                disabled={!isMyTurn}
                onClick={endTurn}
                whileHover={isMyTurn ? { scale: 1.05 } : {}}
                whileTap={isMyTurn ? { scale: 0.95 } : {}}
              >
                End Turn
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Victory/Defeat Modal */}
      <AnimatePresence>
        {gameState.phase === 'END' && (
          <motion.div
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass rounded-2xl p-8 text-center max-w-md"
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ type: 'spring' }}
            >
              <div className="text-6xl mb-4">
                {player.nexusHp > 0 ? '🏆' : '💀'}
              </div>
              <h2 className="text-4xl font-orbitron text-gradient mb-4">
                {player.nexusHp > 0 ? 'VICTORY!' : 'DEFEAT'}
              </h2>
              <p className="text-gray-400 mb-6">
                {player.nexusHp > 0
                  ? 'You have conquered your opponent!'
                  : 'Better luck next time...'}
              </p>

              {/* Rewards */}
              <div className="glass rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-400 mb-2">Rewards</div>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl text-cyan-400">+50</div>
                    <div className="text-xs text-gray-400">Credits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl text-purple-400">+100</div>
                    <div className="text-xs text-gray-400">XP</div>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-primary to-secondary py-3 rounded-lg font-orbitron font-bold hover:opacity-80 transition"
                onClick={() => window.location.href = '/lobby'}
              >
                Return to Lobby
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
