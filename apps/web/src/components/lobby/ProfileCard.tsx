'use client';

import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

export function ProfileCard() {
  const { user } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 flex items-center gap-6"
    >
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl">
        {user?.photoUrl ? (
          <img src={user.photoUrl} alt="Avatar" className="w-full h-full rounded-full" />
        ) : (
          '👤'
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h2 className="text-2xl font-orbitron mb-1">
          {user?.firstName || 'Player'}
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>Level 15</span>
          <span>•</span>
          <span>Diamond III</span>
          <span>•</span>
          <span>1,234 MMR</span>
        </div>
      </div>

      {/* XP Bar */}
      <div className="w-64">
        <div className="flex justify-between text-xs mb-1">
          <span>Level 15</span>
          <span>2,450 / 3,000 XP</span>
        </div>
        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '81.6%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </div>
    </motion.div>
  );
}
