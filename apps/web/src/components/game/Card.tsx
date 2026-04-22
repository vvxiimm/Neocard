'use client';

import { motion } from 'framer-motion';
import { CardDefinition, CardRarity, CardKeyword } from '@nexus/shared';
import { RARITY_CONFIG } from '@nexus/shared';
import { useState } from 'react';

interface CardProps {
  card: CardDefinition;
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  size?: 'small' | 'medium' | 'large';
  showGlow?: boolean;
}

export function Card({
  card,
  isPlayable = true,
  isSelected = false,
  onClick,
  onDragStart,
  onDragEnd,
  size = 'medium',
  showGlow = true,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const rarityConfig = RARITY_CONFIG[card.rarity];

  const sizeClasses = {
    small: 'w-32 h-44',
    medium: 'w-40 h-56',
    large: 'w-48 h-64',
  };

  const isUnit = card.type === 'UNIT';

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} cursor-pointer select-none`}
      whileHover={isPlayable ? { scale: 1.05, y: -10 } : {}}
      whileTap={isPlayable ? { scale: 0.95 } : {}}
      animate={{
        y: isSelected ? -20 : 0,
        rotateY: isHovered ? 5 : 0,
        rotateX: isHovered ? -5 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={isPlayable ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable={isPlayable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Glow Effect */}
      {showGlow && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl blur-xl opacity-60"
          style={{
            background: rarityConfig.gradient,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
        />
      )}

      {/* Card Container */}
      <div
        className={`relative w-full h-full rounded-xl overflow-hidden border-2 transition-all ${
          isPlayable ? 'border-white/30' : 'border-gray-600/50 opacity-50'
        } ${isSelected ? 'ring-4 ring-primary' : ''}`}
        style={{
          background: `linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(10, 14, 39, 0.95) 100%)`,
          boxShadow: isHovered
            ? `0 0 30px ${rarityConfig.glow}`
            : '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Rarity Frame */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: rarityConfig.gradient,
          }}
        />

        {/* Cost Badge */}
        <div
          className="absolute top-2 left-2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl z-10"
          style={{
            background: 'linear-gradient(135deg, #00F0FF 0%, #0088CC 100%)',
            boxShadow: '0 2px 8px rgba(0, 240, 255, 0.5)',
          }}
        >
          {card.cost}
        </div>

        {/* Rarity Gem */}
        <div
          className="absolute top-2 right-2 w-8 h-8 rounded-full z-10"
          style={{
            background: rarityConfig.gradient,
            boxShadow: `0 0 15px ${rarityConfig.glow}`,
          }}
        />

        {/* Card Art */}
        <div className="absolute top-12 left-2 right-2 h-32 rounded-lg overflow-hidden bg-black/30">
          {card.artUrl ? (
            <img
              src={card.artUrl}
              alt={card.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/cards/placeholder.png';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {card.faction === 'TECHBORN' && '⚙️'}
              {card.faction === 'VOIDWALKER' && '🌑'}
              {card.faction === 'LUMINA' && '✨'}
              {card.faction === 'WILDFIRE' && '🔥'}
              {card.faction === 'CHRONOS' && '⏰'}
              {card.faction === 'NEXUS' && '🌀'}
            </div>
          )}

          {/* Rarity Overlay */}
          {card.rarity !== CardRarity.COMMON && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${rarityConfig.glow} 100%)`,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>

        {/* Card Name */}
        <div className="absolute top-44 left-2 right-2 px-2 py-1 bg-black/60 rounded">
          <h3
            className="text-sm font-orbitron font-bold text-center truncate"
            style={{ color: rarityConfig.color }}
          >
            {card.name}
          </h3>
        </div>

        {/* Stats (for units) */}
        {isUnit && (
          <div className="absolute bottom-12 left-2 right-2 flex justify-between px-2">
            {/* Attack */}
            <div className="flex items-center gap-1 bg-red-500/80 px-2 py-1 rounded">
              <span className="text-xs">⚔️</span>
              <span className="font-mono font-bold">{card.attack}</span>
            </div>

            {/* Defense */}
            <div className="flex items-center gap-1 bg-blue-500/80 px-2 py-1 rounded">
              <span className="text-xs">🛡️</span>
              <span className="font-mono font-bold">{card.defense}</span>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-gray-300 text-center line-clamp-2">
          {card.description}
        </div>

        {/* Keywords */}
        {card.keywords.length > 0 && (
          <div className="absolute bottom-8 left-2 right-2 flex flex-wrap gap-1 justify-center">
            {card.keywords.map((keyword) => (
              <span
                key={keyword}
                className="text-xs px-1 py-0.5 bg-primary/30 rounded text-primary font-bold"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Mythic Animation */}
        {card.rarity === CardRarity.MYTHIC && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(45deg, transparent 0%, rgba(255, 0, 255, 0.3) 50%, transparent 100%)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}

        {/* Particles for Legendary+ */}
        {(card.rarity === CardRarity.LEGENDARY || card.rarity === CardRarity.MYTHIC) && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: rarityConfig.color,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Not Playable Overlay */}
      {!isPlayable && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
          <span className="text-red-500 font-bold text-sm">Not Enough Energy</span>
        </div>
      )}
    </motion.div>
  );
}
