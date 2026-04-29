'use client';

import { useState, useEffect } from 'react';
import { fetchAccountBalance, StellarAsset } from '@/lib/stellar';
import PocketCard from './PocketCard';
import Activity from './Activity';
import { CreditCard, History } from 'lucide-react';
import { getTransactions } from '@/lib/history';

export default function Dashboard() {
  const [balances, setBalances] = useState<StellarAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [pocketStats, setPocketStats] = useState<{name: string, balance: number, goal: number, color: string}[]>([]);

  useEffect(() => {
    const publicKey = sessionStorage.getItem('kaChing_user');
    if (publicKey) {
      fetchAccountBalance(publicKey).then((res) => {
        setBalances(res);
        setLoading(false);
      });
    }

    // Sync Pockets from History (Only "My Pockets" - Received)
    const history = getTransactions();
    const pocketBalances: Record<string, number> = {};

    history.forEach(tx => {
      if (tx.type === 'pockets' && tx.status === 'completed' && tx.pockets) {
        tx.pockets.forEach(p => {
          const name = p.name.toLowerCase();
          const isReceived = p.recipient === userAddress;
          
          if (isReceived) {
            pocketBalances[name] = (pocketBalances[name] || 0) + p.amount;
          }
        });
      }
    });

    const colors = [
      'bg-blue-500/20 text-blue-400',
      'bg-emerald-500/20 text-emerald-400',
      'bg-rose-500/20 text-rose-400',
      'bg-amber-500/20 text-amber-400',
    ];

    // Only show pockets that actually have a balance
    const dynamicPockets = Object.keys(pocketBalances)
      .filter(name => pocketBalances[name] > 0)
      .map((name, idx) => ({
        name,
        balance: pocketBalances[name],
        goal: Math.max(pocketBalances[name], 1000), // Dynamic goal that is at least the balance
        color: colors[idx % colors.length]
      })).slice(0, 3);

    setPocketStats(dynamicPockets);
  }, []);

  // Determine XLM balance specifically for the conversion display
  const xlmBalance = balances.find(b => b.code === 'XLM')?.balance || '0';
  const primaryAsset = 
    balances.find(b => b.code === 'USDC') || 
    balances.find(b => b.code !== 'XLM') || 
    balances.find(b => b.code === 'XLM');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-16 h-16 bg-surface rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-surface rounded mb-2"></div>
        <div className="h-3 w-24 bg-surface rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Header Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 p-8 rounded-3xl text-dark shadow-2xl shadow-primary/20">
        <div className="relative z-10">
          <p className="text-sm font-bold opacity-70 uppercase tracking-widest mb-1">Total Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight">
              {primaryAsset ? parseFloat(primaryAsset.balance).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
            </span>
            <span className="text-lg font-bold opacity-80">{primaryAsset?.code || 'USDC'}</span>
          </div>
          {primaryAsset && primaryAsset.code !== 'XLM' && (
            <p className="text-sm font-medium opacity-60 mt-2">
              ≈ {parseFloat(xlmBalance).toFixed(2)} XLM
            </p>
          )}
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <CreditCard size={120} strokeWidth={1} />
        </div>
      </div>

      {/* Pockets Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-bold text-white tracking-tight">Pocket Progress</h2>
          <button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent('change-tab', { detail: 'pockets' }));
            }}
            className="text-primary text-xs font-bold hover:underline"
          >
            Manage All
          </button>
        </div>
        <div className="grid gap-4">
          {pocketStats.map((pocket) => (
            <PocketCard key={pocket.name} {...pocket} />
          ))}
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <History size={18} className="text-primary" /> Recent Activity
          </h2>
          <button 
            onClick={() => {
              // Custom event to signal tab change to Parent
              window.dispatchEvent(new CustomEvent('change-tab', { detail: 'activity' }));
            }}
            className="text-primary text-xs font-bold hover:underline"
          >
            View All
          </button>
        </div>
        <Activity limit={5} showTitle={false} />
      </div>
    </div>
  );
}
