'use client';

import { useState, useEffect } from 'react';
import PocketCard from './PocketCard';
import { PieChart } from 'lucide-react';
import { getTransactions } from '@/lib/history';

export default function PocketsView() {
  const [activeSubTab, setActiveSubTab] = useState<'my' | 'sent'>('my');
  const [myGroups, setMyGroups] = useState<{ id: string, asset: string, sender?: string, date: string, pockets: any[] }[]>([]);
  const [sentGroups, setSentGroups] = useState<{ id: string, asset: string, sender?: string, date: string, pockets: any[] }[]>([]);

  useEffect(() => {
    const userAddress = sessionStorage.getItem('kaChing_user');
    const history = getTransactions();
    
    const myTemp: { id: string, asset: string, date: string, pockets: any[] }[] = [];
    const sentTemp: { id: string, asset: string, date: string, pockets: any[] }[] = [];

    const colors = [
      'bg-blue-500/20 text-blue-400',
      'bg-emerald-500/20 text-emerald-400',
      'bg-rose-500/20 text-rose-400',
      'bg-amber-500/20 text-amber-400',
    ];

    history.forEach(tx => {
      if (tx.type === 'pockets' && tx.status === 'completed' && tx.pockets) {
        const txRecipient = tx.recipient;
        const isUserSender = tx.direction === 'sent';

        const relevantPocketsForMe = tx.pockets.filter(p => {
          const pRecipient = (p.recipient || txRecipient || '').toLowerCase();
          return (userAddress || '').toLowerCase() && pRecipient === (userAddress || '').toLowerCase();
        });

        const relevantPocketsForSent = isUserSender ? tx.pockets : [];

        const txAmount = tx.pockets.reduce((sum, p) => sum + p.amount, 0);

        if (relevantPocketsForMe.length > 0) {
          myTemp.push({
            id: tx.id,
            asset: tx.asset,
            sender: tx.sender || (isUserSender ? userAddress || undefined : 'External Sender'),
            date: new Date(tx.timestamp).toLocaleString(),
            pockets: relevantPocketsForMe.map((p, idx) => ({
              ...p,
              balance: p.amount,
              color: colors[idx % colors.length],
              goal: p.amount, 
              asset: tx.asset
            }))
          });
        }

        if (relevantPocketsForSent.length > 0) {
          sentTemp.push({
            id: tx.id,
            asset: tx.asset,
            sender: tx.sender || (isUserSender ? userAddress || undefined : undefined),
            date: new Date(tx.timestamp).toLocaleString(),
            pockets: relevantPocketsForSent.map((p, idx) => ({
              ...p,
              balance: p.amount,
              color: colors[idx % colors.length],
              goal: p.amount, 
              asset: tx.asset
            }))
          });
        }
      }
    });

    setMyGroups(myTemp);
    setSentGroups(sentTemp);
  }, []);

  const currentGroups = activeSubTab === 'my' ? myGroups : sentGroups;
  const totalValue = currentGroups.reduce((acc, group) => 
    acc + group.pockets.reduce((pAcc, p) => pAcc + p.amount, 0), 0
  );
  const primaryAsset = currentGroups[0]?.asset || 'XLM';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PieChart className="text-primary" /> Pockets
        </h1>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveSubTab('my')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'my' ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white'}`}
          >
            MY POCKETS
          </button>
          <button 
            onClick={() => setActiveSubTab('sent')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${activeSubTab === 'sent' ? 'bg-primary text-dark shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white'}`}
          >
            SENT POCKETS
          </button>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
          {activeSubTab === 'my' ? 'Total My Value' : 'Total Sent Value'}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">{totalValue.toFixed(2)}</span>
          <span className="text-sm font-bold text-gray-500 uppercase">{primaryAsset}</span>
        </div>
      </div>

      <div className="space-y-8">
        {currentGroups.length > 0 ? (
          currentGroups.map((group) => (
            <div key={group.id} className="space-y-4">
              <div className="flex items-center gap-3 px-1">
                <div className="h-[1px] flex-1 bg-white/5"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Transaction {group.id.substring(0, 8)}</span>
                  {group.sender && (
                    <span className="text-[8px] font-bold text-gray-500 mt-0.5">
                      From: {group.sender.length > 20 ? 
                        `${group.sender.substring(0, 6)}...${group.sender.substring(group.sender.length - 4)}` : 
                        group.sender}
                    </span>
                  )}
                  <span className="text-[8px] font-bold text-gray-600">{group.date}</span>
                </div>
                <div className="h-[1px] flex-1 bg-white/5"></div>
              </div>
              
              <div className="grid gap-4">
                {group.pockets.map((pocket, pIdx) => (
                  <PocketCard key={`${group.id}-${pIdx}`} {...pocket} actionLabel={activeSubTab === 'sent' ? 'View' : undefined} />
                ))}
              </div>
            </div>
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
