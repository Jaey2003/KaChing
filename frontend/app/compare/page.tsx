'use client';

import { useRouter } from 'next/navigation';
import WalletConnect from '@/components/WalletConnect';
import FeeComparison from '@/components/FeeComparison';
import Navigation from '@/components/Navigation';

export default function ComparePage() {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    // Navigate back to home with the selected tab
    router.push(`/?tab=${tab}`);
  };

  return (
    <main className="min-h-screen bg-dark text-white p-6 pb-32">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Compare Routes</h1>
          <WalletConnect />
        </div>
        
        <div className="glass p-6 rounded-3xl">
          <FeeComparison />
        </div>
      </div>
      <Navigation activeTab="transfer" onTabChange={handleTabChange} />
    </main>
  );
}