'use client';

import PocketCard from './PocketCard';
import { PieChart, Plus } from 'lucide-react';

export default function PocketsView() {
  const pockets = [
    { name: 'tuition', balance: 450.00, goal: 1000, color: 'bg-blue-500/20 text-blue-400' },
    { name: 'savings', balance: 120.50, goal: 500, color: 'bg-emerald-500/20 text-emerald-400' },
    { name: 'medical', balance: 85.00, goal: 200, color: 'bg-rose-500/20 text-rose-400' },
    { name: 'vacation', balance: 0.00, goal: 1500, color: 'bg-amber-500/20 text-amber-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PieChart className="text-primary" /> My Pockets
        </h1>
        <button className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition">
          <Plus size={24} />
        </button>
      </div>

      <div className="grid gap-4">
        {pockets.map((pocket) => (
          <PocketCard key={pocket.name} {...pocket} />
        ))}
      </div>

      <div className="p-6 glass rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
          <Plus size={24} />
        </div>
        <h3 className="font-bold text-gray-300">Create New Pocket</h3>
        <p className="text-xs text-gray-500">Start saving for a specific goal today.</p>
      </div>
    </div>
  );
}
