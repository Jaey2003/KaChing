'use client';

import { useState, useEffect } from 'react';
import PocketCard from './PocketCard';
import { PieChart } from 'lucide-react';
import { getTransactions } from '@/lib/history';

export default function PocketsView() {
  const [activeSubTab, setActiveSubTab] = useState<'my' | 'sent'>('my');
  const [myPockets, setMyPockets] = useState<{name: string, balance: number, goal: number, color: string}[]>([]);
  const [sentPockets, setSentPockets] = useState<{name: string, balance: number, goal: number, color: string}[]>([]);

  useEffect(() => {
    const userAddress = sessionStorage.getItem('kaChing_user');
    const history = getTransactions();
    
    const myBalances: Record<string, number> = {};
    const sentBalances: Record<string, number> = {};

    history.forEach(tx => {
      if (tx.type === 'pockets' && tx.status === 'completed' && tx.pockets) {
        tx.pockets.forEach(p => {
          const name = p.name.toLowerCase();
          
          // My Pockets: Funds RECEIVED from someone else
          // (Recipient is Me, and it's an incoming transaction)
          const isReceived = p.recipient === userAddress;
          
          // Sent Pockets: Funds SENT to someone else
          // (Recipient is NOT me, and I was the sender)
          const isSent = p.recipient && p.recipient !== userAddress;
          
          if (isReceived) {
            myBalances[name] = (myBalances[name] || 0) + p.amount;
          } else if (isSent) {
            sentBalances[name] = (sentBalances[name] || 0) + p.amount;
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

    const formatPockets = (balances: Record<string, number>) => 
      Object.keys(balances).map((name, idx) => ({
        name,
        balance: balances[name],
        goal: 1000,
        color: colors[idx % colors.length]
      }));

    setMyPockets(formatPockets(myBalances));
    setSentPockets(formatPockets(sentBalances));
  }, []);

  const currentPockets = activeSubTab === 'my' ? myPockets : sentPockets;
  const totalBalance = currentPockets.reduce((acc, p) => acc + p.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PieChart className="text-primary" /> Pockets
        </h1>
        
        {/* Sub-tabs for My vs Sent */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveSubTab('my')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeSubTab === 'my' ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white'
            }`}
          >
            MY POCKETS
          </button>
          <button 
            onClick={() => setActiveSubTab('sent')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeSubTab === 'sent' ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white'
            }`}
          >
            SENT POCKETS
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="glass p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
          {activeSubTab === 'my' ? 'Total My Value' : 'Total Sent Value'}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">${totalBalance.toFixed(2)}</span>
          <span className="text-sm font-bold text-gray-500 uppercase">USD</span>
        </div>
      </div>

      <div className="grid gap-4">
        {currentPockets.length > 0 ? (
          currentPockets.map((pocket) => (
            <PocketCard key={pocket.name} {...pocket} />
          ))
        ) : (
          <div className="py-20 text-center glass rounded-3xl border border-dashed border-white/10">
            <p className="text-sm text-gray-500">No {activeSubTab === 'my' ? 'received' : 'sent'} pockets found</p>
          </div>
        )}
      </div>
    </div>
  );
}
