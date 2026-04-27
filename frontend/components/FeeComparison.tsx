'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Clock } from 'lucide-react';
import { mockAnchorQuotes, playKaChingSound } from '@/lib/utils';

export default function FeeComparison() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = parseFloat(searchParams.get('amount') || '0');
  
  const quotes = mockAnchorQuotes(amount);
  const bestQuote = quotes[0];
  const avgFee = quotes.reduce((acc, q) => acc + q.totalFee, 0) / quotes.length;
  const savings = avgFee - bestQuote.totalFee;
  const shouldPlaySound = savings > 0;

  const handleSelect = () => {
    if (shouldPlaySound) {
      playKaChingSound();
    }
    router.push(`/dashboard?amount=${amount}&fee=${bestQuote.feePct}&tuition=${searchParams.get('tuition')}&savings=${searchParams.get('savings')}&medical=${searchParams.get('medical')}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Route Comparison</h2>
      
      {quotes.map((quote, idx) => (
        <div
          key={quote.id}
          className={`p-4 rounded-lg border ${
            idx === 0 ? 'border-accent bg-accent/10' : 'border-white/10 bg-surface'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold">{quote.name}</h3>
              <p className="text-sm text-gray-400">ETA: {quote.eta} min</p>
            </div>
            {idx === 0 && (
              <span className="px-2 py-1 bg-accent text-dark text-xs font-bold rounded">
                ⚡ Best Value
              </span>
            )}
          </div>
          
          <div className="space-y-1 text-sm">
            <p>Fee: ${quote.totalFee.toFixed(2)} ({quote.feePct}%)</p>
            <p className="font-bold">Total: ${quote.totalCost.toFixed(2)}</p>
          </div>
        </div>
      ))}

      {shouldPlaySound && (
        <div className="p-3 bg-primary/20 border border-primary rounded-lg text-center">
          <p className="text-primary font-bold">🔊 You save ${savings.toFixed(2)} vs average!</p>
        </div>
      )}

      <button
        onClick={handleSelect}
        className="w-full py-3 bg-primary text-dark font-bold rounded-lg flex items-center justify-center gap-2"
      >
        <Check size={20} /> Select Best Route
      </button>
    </div>
  );
}