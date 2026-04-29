'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  asset?: string;
  actionLabel?: string;
}

export default function PocketCard({ name, balance, goal, color, asset = 'XLM', actionLabel = 'Use it' }: PocketCardProps) {
  const router = useRouter();
  const progress = Math.min((balance / goal) * 100, 100);

  const handleUseIt = () => {
    if (actionLabel === 'Use it') {
      const params = new URLSearchParams();
      params.set('name', name);
      params.set('balance', balance.toString());
      params.set('asset', asset);
      params.set('color', color);
      router.push(`/use-pocket?${params.toString()}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-5 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${color}`}>
            {name.toLowerCase() === 'tuition' ? <GraduationCap size={20} /> : 
             name.toLowerCase() === 'savings' ? <PiggyBank size={20} /> : <Heart size={20} />}
          </div>
          <div>
            <h3 className="font-bold capitalize text-white">{name}</h3>
            <p className="text-sm text-gray-400">
              {balance.toFixed(2)} / {goal.toFixed(2)} <span className="text-[10px] font-bold text-gray-600">{asset}</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-dark rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full ${color} transition-all`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      <button
        onClick={actionLabel === 'Use it' ? handleUseIt : undefined}
        className="w-full py-2 border border-primary text-primary rounded-xl font-bold hover:bg-primary/10 transition-all active:scale-95"
      >
        {actionLabel}
      </button>
    </motion.div>
  );
}