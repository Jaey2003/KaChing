'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, PieChart, History, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { getTransactions, Transaction } from '@/lib/history';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityProps {
  limit?: number;
  showTitle?: boolean;
}

export default function Activity({ limit, showTitle = true }: ActivityProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<'all' | 'direct' | 'pockets'>('all');
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      const publicKey = sessionStorage.getItem('kaChing_user');
      const localHistory = getTransactions();
      
      if (!publicKey) {
        setTransactions(localHistory);
        setLoading(false);
        return;
      }

      try {
        // Fetch last 15 transactions from the blockchain
        const horizonHistory = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}/transactions?limit=15&order=desc`)
          .then(res => res.json());

        const blockchainTxs: Transaction[] = horizonHistory._embedded.records.map((record: any) => ({
          id: record.hash,
          type: record.memo_type === 'text' && record.memo.includes('split') ? 'pockets' : 'direct',
          amount: 0, // Horizon doesn't show amount in top-level tx, would need effects
          asset: 'XLM',
          timestamp: new Date(record.created_at).getTime(),
          status: record.successful ? 'completed' : 'failed',
          fee: parseFloat(record.fee_charged) / 10000000,
          anchor: 'Stellar Network'
        }));

        // Merge and deduplicate by hash/id
        const seen = new Set();
        const merged = [...localHistory, ...blockchainTxs].filter(tx => {
          const duplicate = seen.has(tx.id);
          seen.add(tx.id);
          return !duplicate;
        });

        setTransactions(merged.sort((a, b) => b.timestamp - a.timestamp));
      } catch (e) {
        console.warn('Failed to fetch blockchain history, falling back to local', e);
        setTransactions(localHistory);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const filteredTransactions = transactions
    .filter(tx => filter === 'all' ? true : tx.type === filter)
    .slice(0, limit);

  if (loading) {
    return (
      <div className="py-10 flex flex-col items-center justify-center animate-pulse">
        <div className="w-12 h-12 bg-white/5 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-white/5 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex flex-col gap-4 px-1">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <History size={22} className="text-primary" /> Activity
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
      )}

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, idx) => (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass border border-white/5 rounded-2xl overflow-hidden"
              >
                <div 
                  className="p-4 flex items-center gap-4"
                  onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'pockets' ? 'bg-primary/10 text-primary' : 'bg-white/10 text-white'
                  }`}>
                    {tx.type === 'pockets' ? <PieChart size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-white capitalize truncate pr-2">
                        {tx.type === 'pockets' ? 'Pocket Split' : 'Direct Transfer'}
                      </h3>
                      <p className="text-sm font-black text-white whitespace-nowrap">
                        {tx.amount.toFixed(2)} <span className="text-[10px] text-gray-500 font-bold">{tx.asset}</span>
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <p className="text-[10px] text-gray-500 font-medium">
                        {new Date(tx.timestamp).toLocaleDateString()} • {tx.anchor}
                      </p>
                      {tx.type === 'pockets' && (
                        <div className="text-gray-500">
                          {expandedTx === tx.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedTx === tx.id && tx.type === 'pockets' && tx.pockets && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 overflow-hidden"
                    >
                      <div className="pt-3 border-t border-white/5 space-y-2">
                        {tx.pockets.map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px]">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                              <span className="text-gray-400 font-medium">{p.name}</span>
                            </div>
                            <span className="text-white font-bold">{p.amount.toFixed(2)} {tx.asset} ({p.percentage}%)</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-700">
                <History size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-white font-bold">No activity yet</p>
                <p className="text-gray-500 text-xs px-10">When you send money or split funds, they'll appear here.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
