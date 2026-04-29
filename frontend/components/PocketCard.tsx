'use client';

import { motion } from 'framer-motion';
import { GraduationCap, PiggyBank, Heart, Plane, Coins, Wallet } from 'lucide-react';

const icons = {
  tuition: GraduationCap,
  savings: PiggyBank,
  medical: Heart,
  vacation: Plane,
  default: Coins,
};

interface PocketCardProps {
  name: string;
  balance: number;
  goal: number;
  color: string;
}

export default function PocketCard({ name, balance, goal, color }: PocketCardProps) {
  const Icon = icons[name as keyof typeof icons] || icons.default;
  const progress = (balance / goal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-surface rounded-lg border border-white/10"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-bold capitalize">{name}</h3>
          <p className="text-sm text-gray-400">${balance.toFixed(2)} / ${goal}</p>
        </div>
      </div>
      
      <div className="w-full bg-dark rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full ${color} transition-all`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      <button className="w-full py-2 border border-primary text-primary rounded-xl font-bold hover:bg-primary/10 transition-all active:scale-95">
        Use it
      </button>
    </motion.div>
  );
}