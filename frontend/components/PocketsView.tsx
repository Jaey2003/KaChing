'use client';

import { useState, useEffect } from 'react';
import PocketCard from './PocketCard';
import { PieChart } from 'lucide-react';
import { getTransactions } from '@/lib/history';

export default function PocketsView() {
  const [pocketStats, setPocketStats] = useState([
    { name: 'tuition', balance: 0, goal: 1000, color: 'bg-blue-500/20 text-blue-400' },
    { name: 'savings', balance: 0, goal: 500, color: 'bg-emerald-500/20 text-emerald-400' },
    { name: 'medical', balance: 0, goal: 200, color: 'bg-rose-500/20 text-rose-400' },
    { name: 'vacation', balance: 0, goal: 1500, color: 'bg-amber-500/20 text-amber-400' },
  ]);

  useEffect(() => {
    const history = getTransactions();
    const balances: Record<string, number> = {
      tuition: 0,
      savings: 0,
      medical: 0,
      vacation: 0
    };

    // Sum up amounts from all successful pocket transactions
    history.forEach(tx => {
      if (tx.type === 'pockets' && tx.status === 'completed' && tx.pockets) {
        tx.pockets.forEach(p => {
          const name = p.name.toLowerCase();
          if (balances[name] !== undefined) {
            balances[name] += p.amount;
          } else {
            // Support custom pockets if any
            balances[name] = p.amount;
          }
        });
      }
    });

    setPocketStats(prev => prev.map(p => ({
      ...p,
      balance: balances[p.name.toLowerCase()] || 0
    })));
  }, []);

  const totalBalance = pocketStats.reduce((acc, p) => acc + p.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PieChart className="text-primary" /> My Pockets
        </h1>
      </div>

      {/* Summary Card for "One Transaction" feel */}
      <div className="glass p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Pocket Value</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">${totalBalance.toFixed(2)}</span>
              <span className="text-sm font-bold text-gray-500 uppercase">USD</span>
            </div>
          </div>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('change-tab', { detail: 'transfer' }))}
            className="px-4 py-2 bg-primary text-dark text-xs font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            FUND ALL POCKETS
          </button>
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
