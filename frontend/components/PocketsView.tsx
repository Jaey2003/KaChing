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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PieChart className="text-primary" /> My Pockets
        </h1>
      </div>

      <div className="grid gap-4">
        {pockets.map((pocket) => (
          <PocketCard key={pocket.name} {...pocket} />
        ))}
      </div>
    </div>
  );
}
