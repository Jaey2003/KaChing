'use client';

import { useState, useEffect } from 'react';
import { fetchAccountBalance } from '@/lib/stellar';
import { Wallet, Bell, PieChart, Send as SendIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const [balance, setBalance] = useState<string>('0.00');
  const [assetCode, setAssetCode] = useState<string>('USDC');
  const [address, setAddress] = useState<string>('');
  const [myPocketsTotal, setMyPocketsTotal] = useState<number>(0);
  const [sentPocketsTotal, setSentPocketsTotal] = useState<number>(0);

  const calculatePockets = () => {
    const user = sessionStorage.getItem('kaChing_user');
    if (!user) return;
    
    const { getTransactions } = require('@/lib/history');
    const history = getTransactions();
    
    let mySum = 0;
    let sentSum = 0;

    history.forEach((tx: any) => {
      if (tx.type === 'pockets' && tx.status === 'completed' && tx.pockets) {
        const txRecipient = tx.recipient;
        const isUserSender = tx.direction === 'sent';

        tx.pockets.forEach((p: any) => {
          const pRecipient = (p.recipient || txRecipient || '').toLowerCase();
          const myAddr = user.toLowerCase();
          
          if (pRecipient === myAddr) {
            mySum += p.amount;
          }
          if (isUserSender && pRecipient !== myAddr && pRecipient !== '') {
            sentSum += p.amount;
          }
        });
      }
    });

    setMyPocketsTotal(mySum);
    setSentPocketsTotal(sentSum);
  };

  useEffect(() => {
    const user = sessionStorage.getItem('kaChing_user');
    if (user) {
      setAddress(user);
      fetchAccountBalance(user).then((res) => {
        const primary = res.find(b => b.code === 'USDC') || res.find(b => b.code === 'XLM');
        if (primary) {
          setBalance(parseFloat(primary.balance).toLocaleString(undefined, { minimumFractionDigits: 2 }));
          setAssetCode(primary.code);
        }
      });
      calculatePockets();
    }

    const handleRefresh = () => {
      const user = sessionStorage.getItem('kaChing_user');
      if (user) {
        fetchAccountBalance(user).then((res) => {
          const primary = res.find(b => b.code === 'USDC') || res.find(b => b.code === 'XLM');
          if (primary) {
            setBalance(parseFloat(primary.balance).toLocaleString(undefined, { minimumFractionDigits: 2 }));
            setAssetCode(primary.code);
          }
        });
        calculatePockets();
      }
    };

    window.addEventListener('balance-updated', handleRefresh);
    return () => window.removeEventListener('balance-updated', handleRefresh);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-2xl mx-auto flex justify-between items-center bg-dark/40 backdrop-blur-xl border border-white/5 rounded-2xl p-2 px-4 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-dark font-black text-xs">K$</span>
          </div>
          <span className="text-sm font-black text-white tracking-tight">KaChing</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Main Balance */}
          <div className="bg-white/5 py-1.5 px-2.5 sm:px-3 rounded-xl border border-white/5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-white">{balance}</span>
              <span className="text-[8px] font-bold text-gray-500">{assetCode}</span>
            </div>
          </div>

          {/* My Pockets Balance */}
          <div className="flex bg-blue-500/10 py-1.5 px-2.5 sm:px-3 rounded-xl border border-blue-500/10 items-center gap-2">
            <PieChart size={12} className="text-blue-400" />
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-blue-400">{myPocketsTotal.toFixed(2)}</span>
              <span className="text-[8px] font-bold text-blue-500/50">{assetCode}</span>
            </div>
          </div>

          {/* Sent Pockets Balance */}
          <div className="flex bg-emerald-500/10 py-1.5 px-2.5 sm:px-3 rounded-xl border border-emerald-500/10 items-center gap-2">
            <SendIcon size={12} className="text-emerald-400" />
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-emerald-400">{sentPocketsTotal.toFixed(2)}</span>
              <span className="text-[8px] font-bold text-emerald-500/50">{assetCode}</span>
            </div>
          </div>
          
          <button className="relative w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <Bell size={18} />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-dark" />
          </button>
        </div>
      </div>
    </header>
  );
}
