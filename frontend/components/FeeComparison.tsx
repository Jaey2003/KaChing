'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Info, ShieldCheck, ArrowRight, Wallet, Clock } from 'lucide-react';
import { mockAnchorQuotes, playKaChingSound } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function FeeComparison() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const amount = parseFloat(searchParams.get('amount') || '0');
  const asset = searchParams.get('asset') || 'USDC';
  const mode = searchParams.get('mode') || 'pockets';
  const recipient = searchParams.get('recipient') || '';
  
  const quotes = mockAnchorQuotes(amount);
  const bestQuote = quotes[0];
  const avgFee = quotes.reduce((acc, q) => acc + q.totalFee, 0) / quotes.length;
  const savings = avgFee - bestQuote.totalFee;
  const shouldPlaySound = savings > 0;

  // Extract all pockets from search params (anything that isn't amount, asset, mode, or recipient)
  const pocketData: { name: string; percentage: number; amount: number }[] = [];
  const excludedKeys = ['amount', 'asset', 'mode', 'recipient'];
  
  searchParams.forEach((value, key) => {
    if (!excludedKeys.includes(key)) {
      const percentage = parseInt(value);
      if (!isNaN(percentage)) {
        pocketData.push({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          percentage,
          amount: ((amount - bestQuote.totalFee) * percentage) / 100
        });
      }
    }
  });

  const handleSelect = () => {
    if (shouldPlaySound) {
      playKaChingSound();
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set('fee', bestQuote.feePct.toString());
    params.set('selectedAnchor', bestQuote.name);
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Anchor Options - NOW AT THE TOP */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Provider Quotes</p>
        <div className="space-y-3">
          {quotes.map((quote, idx) => (
            <button
              key={quote.id}
              className={`w-full p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                idx === 0 
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' 
                  : 'border-white/5 bg-white/5 hover:border-white/20'
              }`}
            >
              {idx === 0 && (
                <div className="absolute top-0 right-0 bg-primary px-2 py-1 rounded-bl-lg">
                  <span className="text-[10px] font-black text-dark uppercase tracking-tighter">Best Value</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    {quote.name}
                    {idx === 0 && <Check size={14} className="text-primary" />}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> {quote.eta}m
                    </span>
                    <span className="text-[10px] font-medium text-gray-400">
                      Fee: {quote.feePct}% ({quote.totalFee.toFixed(2)} {asset})
                    </span>
                    {/* @ts-ignore */}
                    {quote.domain && (
                      <span className="text-[10px] font-medium text-primary/60 italic">
                        {/* @ts-ignore */}
                        {quote.domain}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{quote.totalCost.toFixed(2)} {asset}</p>
                  <p className="text-[10px] text-gray-500 font-medium">Est. Final Cost</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Transfer Summary</h2>
        <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
          <ShieldCheck size={14} className="text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Fee Compliant</span>
        </div>
      </div>

      {/* Main Breakdown */}
      <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Principal Amount</span>
          <span className="font-medium text-white">{amount.toFixed(2)} {asset}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Anchor Fee ({bestQuote.name})</span>
          <span className="font-medium text-rose-400">-{bestQuote.totalFee.toFixed(2)} {asset}</span>
        </div>
        <div className="pt-3 border-t border-white/5 flex justify-between items-center">
          <span className="text-sm font-bold text-white">
            {mode === 'direct' ? 'Amount to Recipient' : 'Net to Pockets'}
          </span>
          <span className="text-lg font-black text-primary">{(amount - bestQuote.totalFee).toFixed(2)} {asset}</span>
        </div>
      </div>

      {/* Recipient Display (Direct Mode) */}
      {mode === 'direct' && recipient && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Recipient</p>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Wallet size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-gray-400 mb-0.5 uppercase font-bold tracking-tighter">Stellar Address</p>
              <p className="text-sm text-white font-mono truncate">{recipient}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pockets Breakdown (Pockets Mode) */}
      {mode === 'pockets' && pocketData.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Allocations</p>
          <div className="grid gap-2">
            {pocketData.map((pocket, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={pocket.name} 
                className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {pocket.percentage}%
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{pocket.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{pocket.amount.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">{asset}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {shouldPlaySound && (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Info size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-primary">Smart Routing Active</p>
            <p className="text-xs text-primary/70">You're saving ${savings.toFixed(2)} compared to market average.</p>
          </div>
        </motion.div>
      )}

      <button
        onClick={handleSelect}
        className="w-full py-4 bg-primary text-dark font-black rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
      >
        {mode === 'direct' ? 'Confirm & Send Money' : 'Confirm & Execute Split'} <ArrowRight size={20} />
      </button>
    </div>
  );
}

