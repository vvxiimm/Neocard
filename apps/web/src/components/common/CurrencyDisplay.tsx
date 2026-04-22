'use client';

import { useAuthStore } from '@/store/authStore';
import { CurrencyType } from '@nexus/shared';

export function CurrencyDisplay() {
  const currencies = [
    { type: CurrencyType.CREDITS, symbol: '₵', amount: 1250, color: 'text-cyan-400' },
    { type: CurrencyType.SHARDS, symbol: '◆', amount: 50, color: 'text-purple-400' },
    { type: CurrencyType.CHIPS, symbol: '⬢', amount: 1000, color: 'text-yellow-400' },
    { type: CurrencyType.DUST, symbol: '✦', amount: 320, color: 'text-gray-400' },
  ];

  return (
    <div className="flex gap-4">
      {currencies.map((currency) => (
        <div
          key={currency.type}
          className="glass px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span className={`text-xl ${currency.color}`}>{currency.symbol}</span>
          <span className="font-mono font-bold">{currency.amount.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
