'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export function GameModeCard({ mode }: { mode: GameMode }) {
  const router = useRouter();

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push(`/game/${mode.id}`)}
      className="glass rounded-xl p-6 text-left relative overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-20 transition-opacity`} />

      <div className="relative z-10">
        <div className="text-4xl mb-4">{mode.icon}</div>
        <h3 className="text-xl font-orbitron mb-2">{mode.name}</h3>
        <p className="text-sm text-gray-400">{mode.description}</p>
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/5 to-transparent rounded-tl-full" />
    </motion.button>
  );
}
