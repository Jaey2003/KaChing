'use client';

import { useState, useEffect } from 'react';
import { fetchAccountBalance, StellarAsset } from '@/lib/stellar';
import PocketCard from './PocketCard';
import { CreditCard, ArrowUpRight, PieChart, ChevronDown, ChevronUp, History, Filter } from 'lucide-react';
import { getTransactions, Transaction } from '@/lib/history';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [balances, setBalances] = useState<StellarAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'direct' | 'pockets'>('all');
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

  useEffect(() => {
    const publicKey = sessionStorage.getItem('kaChing_user');
    if (publicKey) {
      fetchAccountBalance(publicKey).then((res) => {
        setBalances(res);
        setLoading(false);
      });
    }
    
    const history = getTransactions();
    // Add dummy transactions if empty for demo purposes
    if (history.length === 0) {
      const dummyHistory: Transaction[] = [
        {
          id: 'TX1',
          type: 'pockets',
          amount: 500,
          asset: 'USDC',
          timestamp: Date.now() - 3600000,
          pockets: [
            { name: 'Tuition', percentage: 50, amount: 250 },
            { name: 'Savings', percentage: 30, amount: 150 },
            { name: 'Medical', percentage: 20, amount: 100 },
          ],
          status: 'completed',
          fee: 0.5,
          anchor: 'Stellar Anchor'
        },
        {
          id: 'TX2',
          type: 'direct',
          amount: 120,
          asset: 'XLM',
          timestamp: Date.now() - 86400000,
          recipient: 'GBBD...FLA5',
          status: 'completed',
          fee: 0.1,
          anchor: 'Direct Transfer'
        }
      ];
      setTransactions(dummyHistory);
    } else {
      setTransactions(history);
    }
  }, []);

  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' ? true : tx.type === filter
  );

  const toggleExpand = (id: string) => {
    setExpandedTx(expandedTx === id ? null : id);
  };

  // Determine XLM balance specifically for the conversion display
  const xlmBalance = balances.find(b => b.code === 'XLM')?.balance || '0';
  const primaryAsset = 
    balances.find(b => b.code === 'USDC') || 
    balances.find(b => b.code !== 'XLM') || 
    balances.find(b => b.code === 'XLM');

  const pockets = [
    { name: 'tuition', balance: 450.00, goal: 1000, color: 'bg-blue-500/20 text-blue-400' },
    { name: 'savings', balance: 120.50, goal: 500, color: 'bg-emerald-500/20 text-emerald-400' },
    { name: 'medical', balance: 85.00, goal: 200, color: 'bg-rose-500/20 text-rose-400' },
  ];

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
          <button className="text-primary text-xs font-bold hover:underline">Manage All</button>
        </div>
        <div className="grid gap-4">
          {pockets.map((pocket) => (
            <PocketCard key={pocket.name} {...pocket} />
          ))}
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 px-1">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <History size={18} className="text-primary" /> Activity
            </h2>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              {(['all', 'direct', 'pockets'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    filter === t ? 'bg-primary text-dark shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass border border-white/5 rounded-2xl overflow-hidden"
                >
                  <div 
                    className="p-4 flex items-center gap-4"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'pockets' ? 'bg-primary/10 text-primary' : 'bg-white/10 text-white'
                    }`}>
                      {tx.type === 'pockets' ? <PieChart size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-white capitalize">
                          {tx.type === 'pockets' ? 'Pocket Split' : 'Direct Transfer'}
                        </h3>
                        <p className="text-sm font-black text-white">
                          {tx.amount.toFixed(2)} <span className="text-[10px] text-gray-500">{tx.asset}</span>
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-0.5">
                        <p className="text-[10px] text-gray-500 font-medium">
                          {new Date(tx.timestamp).toLocaleDateString()} • {tx.anchor}
                        </p>
                        {tx.type === 'direct' && tx.recipient && (
                          <p className="text-[10px] text-primary/60 font-mono truncate max-w-[100px]">
                            {tx.recipient}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pockets Footer Section */}
                  {tx.type === 'pockets' && tx.pockets && (
                    <div className="px-4 py-3 bg-white/5 border-t border-white/5">
                      <div className="flex flex-wrap gap-2">
                        {tx.pockets.map((p, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-dark/50 rounded-lg border border-white/5"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                              {p.name}
                            </span>
                            <span className="text-[10px] font-black text-primary">
                              {p.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-600">
                  <History size={24} />
                </div>
                <p className="text-gray-500 text-sm font-medium">No transactions found</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

