'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import WalletConnect from '@/components/WalletConnect';
import PocketCard from '@/components/PocketCard';
import KaChingAnimation from '@/components/KaChingAnimation';
import { playKaChingSound } from '@/lib/utils';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [showAnimation, setShowAnimation] = useState(true);
  
  const amount = parseFloat(searchParams.get('amount') || '100');
  const feePct = parseFloat(searchParams.get('fee') || '0.8');
  const tuitionPct = parseFloat(searchParams.get('tuition') || '50');
  const savingsPct = parseFloat(searchParams.get('savings') || '30');
  const medicalPct = parseFloat(searchParams.get('medical') || '20');

  useEffect(() => {
    playKaChingSound();
    const timer = setTimeout(() => setShowAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const netAmount = amount - (amount * feePct / 100);
  const tuition = (netAmount * tuitionPct) / 100;
  const savings = (netAmount * savingsPct) / 100;
  const medical = netAmount - tuition - savings;

  return (
    <main className="min-h-screen p-6">
      {showAnimation && <KaChingAnimation />}
      
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Pockets</h1>
          <WalletConnect />
        </div>

        <div className="glass p-4 rounded-xl">
          <p className="text-sm text-gray-400 mb-1">Total Received</p>
          <p className="text-3xl font-bold text-primary">${netAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-500">After {feePct}% fee</p>
        </div>

        <div className="space-y-4">
          <PocketCard name="tuition" balance={tuition} goal={120} color="bg-blue-500" />
          <PocketCard name="savings" balance={savings} goal={100} color="bg-green-500" />
          <PocketCard name="medical" balance={medical} goal={50} color="bg-red-500" />
        </div>
      </div>
    </main>
  );
}