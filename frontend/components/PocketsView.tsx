'use client';

import PocketCard from './PocketCard';
import { PieChart } from 'lucide-react';

export default function PocketsView() {
  const pockets = [
    { name: 'tuition', balance: 450.00, goal: 1000, color: 'bg-blue-500/20 text-blue-400' },
    { name: 'savings', balance: 120.50, goal: 500, color: 'bg-emerald-500/20 text-emerald-400' },
    { name: 'medical', balance: 85.00, goal: 200, color: 'bg-rose-500/20 text-rose-400' },
    { name: 'vacation', balance: 0.00, goal: 1500, color: 'bg-amber-500/20 text-amber-400' },
  ];

  const totalBalance = pockets.reduce((acc, p) => acc + p.balance, 0);

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
        {pockets.map((pocket) => (
          <PocketCard key={pocket.name} {...pocket} />
        ))}
      </div>
    </div>
  );
}
