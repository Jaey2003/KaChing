'use client';

import { useState, useEffect } from 'react';
import { fetchAccountBalance, StellarAsset } from '@/lib/stellar';
import { Wallet, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const [balance, setBalance] = useState<string>('0.00');
  const [assetCode, setAssetCode] = useState<string>('USDC');
  const [address, setAddress] = useState<string>('');

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
    }

    // Listen for balance refreshes (custom event)
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
      }
    };

    window.addEventListener('balance-updated', handleRefresh);
    return () => window.removeEventListener('balance-updated', handleRefresh);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-md mx-auto flex justify-between items-center bg-dark/40 backdrop-blur-xl border border-white/5 rounded-2xl p-2 px-4 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-dark font-black text-xs">K$</span>
          </div>
          <span className="text-sm font-black text-white tracking-tight">KaChing</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/5 py-1.5 px-3 rounded-xl border border-white/5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-white">{balance}</span>
              <span className="text-[8px] font-bold text-gray-500">{assetCode}</span>
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
