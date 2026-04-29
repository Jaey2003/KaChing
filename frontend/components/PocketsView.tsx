'use client';

import { useState, useEffect } from 'react';
import PocketCard from './PocketCard';
import { PieChart } from 'lucide-react';
import { getTransactions } from '@/lib/history';

export default function PocketsView() {
  const [pocketStats, setPocketStats] = useState<{name: string, balance: number, goal: number, color: string}[]>([]);

  useEffect(() => {
    const history = getTransactions();
    const balances: Record<string, number> = {};

    // Dynamically discover all pockets from successful transactions
    history.forEach(tx => {
      if (tx.type === 'pockets' && tx.status === 'completed' && tx.pockets) {
        tx.pockets.forEach(p => {
          const name = p.name.toLowerCase();
          if (balances[name] !== undefined) {
            balances[name] += p.amount;
          } else {
            balances[name] = p.amount;
          }
        });
      }
    });

    const colors = [
      'bg-blue-500/20 text-blue-400',
      'bg-emerald-500/20 text-emerald-400',
      'bg-rose-500/20 text-rose-400',
      'bg-amber-500/20 text-amber-400',
      'bg-purple-500/20 text-purple-400',
      'bg-cyan-500/20 text-cyan-400'
    ];

    const dynamicPockets = Object.keys(balances).map((name, idx) => ({
      name,
      balance: balances[name],
      goal: 1000, // Default goal for dynamic pockets
      color: colors[idx % colors.length]
    }));

    setPocketStats(dynamicPockets);
  }, []);

  const totalBalance = pocketStats.reduce((acc, p) => acc + p.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PieChart className="text-primary" /> My Pockets
        </h1>
      </div>

      {/* Summary Card */}
      <div className="glass p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Pocket Value</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">${totalBalance.toFixed(2)}</span>
          <span className="text-sm font-bold text-gray-500 uppercase">USD</span>
        </div>
      </div>

      <div className="grid gap-4">
        {pocketStats.map((pocket) => (
          <PocketCard key={pocket.name} {...pocket} />
        ))}
      </div>
    </div>
  );
}
