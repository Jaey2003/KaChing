'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Home, Share2, Download, Wallet, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const amount = parseFloat(searchParams.get('amount') || '0');
  const asset = searchParams.get('asset') || 'USDC';
  const mode = searchParams.get('mode') || 'pockets';
  const recipient = searchParams.get('recipient') || '';
  const fee = parseFloat(searchParams.get('fee') || '0');
  const anchor = searchParams.get('selectedAnchor') || 'Stellar Network';

  const totalFee = (amount * fee) / 100;
  const netAmount = amount - totalFee;

  // Extract pockets
  const pocketData: { name: string; percentage: number; amount: number }[] = [];
  const excludedKeys = ['amount', 'asset', 'mode', 'recipient', 'fee', 'selectedAnchor'];
  
  searchParams.forEach((value, key) => {
    if (!excludedKeys.includes(key)) {
      const percentage = parseInt(value);
      if (!isNaN(percentage)) {
        pocketData.push({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          percentage,
          amount: (netAmount * percentage) / 100
        });
      }
    }
  });

  const hash = searchParams.get('hash') || '';

  return (
    <main className="min-h-screen bg-dark text-white p-6 pb-32">
      <div className="max-w-md mx-auto pt-10 space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto border-4 border-primary/30"
          >
            <CheckCircle2 size={48} className="text-primary" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-black text-white">Transfer Success!</h1>
            <p className="text-gray-400 mt-1 font-medium">Your funds are on the way</p>
          </motion.div>
        </div>

        {/* Transaction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl overflow-hidden border border-white/5 relative"
        >
          <div className="bg-primary/10 p-6 text-center border-b border-white/5">
            <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-1">Total Sent</p>
            <h2 className="text-4xl font-black text-white">{amount.toFixed(2)} <span className="text-xl text-primary">{asset}</span></h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Provider</p>
                <p className="text-sm font-bold text-white">{anchor}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Network Fee</p>
                <p className="text-sm font-bold text-rose-400">-{totalFee.toFixed(2)} {asset}</p>
              </div>
            </div>

            {/* Mode Specific Summary */}
            <div className="pt-6 border-t border-white/5">
              {mode === 'direct' ? (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Wallet size={12} className="text-primary" /> Recipient Address
                  </p>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-xs font-mono text-white break-all leading-relaxed opacity-80">
                      {recipient}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <PieChart size={12} className="text-primary" /> Pocket Allocations
                  </p>
                  <div className="space-y-2">
                    {pocketData.map((pocket) => (
                      <div key={pocket.name} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm font-bold text-white">{pocket.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">{pocket.amount.toFixed(2)} {asset}</p>
                          <p className="text-[10px] text-gray-500 font-bold">{pocket.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom Badge - Explorer Link */}
          {hash && (
            <a 
              href={`https://stellar.expert/explorer/testnet/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 p-4 text-center border-t border-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
            >
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest group-hover:text-primary transition-colors">View on Explorer</p>
                <p className="text-[10px] text-gray-400 font-mono truncate px-4">{hash}</p>
              </div>
              <ArrowRight size={14} className="text-gray-500 group-hover:text-primary -rotate-45" />
            </a>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={() => router.push('/?tab=home')}
            className="w-full py-4 bg-primary text-dark font-black rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
          >
            Back to Dashboard <Home size={20} />
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 bg-white/5 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/5 text-sm">
              <Share2 size={16} /> Share
            </button>
            <button className="py-3 bg-white/5 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/5 text-sm">
              <Download size={16} /> Receipt
            </button>
          </div>
        </motion.div>
      </div>

      <Navigation activeTab="transfer" onTabChange={(tab) => router.push(`/?tab=${tab}`)} />
    </main>
  );
}
