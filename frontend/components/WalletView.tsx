'use client';

import { useState, useEffect } from 'react';
import { Wallet, Copy, ExternalLink, LogOut, Shield, Zap, RefreshCw } from 'lucide-react';
import { fetchAccountBalance, StellarAsset } from '@/lib/stellar';
import { motion } from 'framer-motion';

export default function WalletView() {
  const [address, setAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<StellarAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem('kaChing_user');
    if (user) {
      setAddress(user);
      refreshBalances(user);
    }
  }, []);

  const refreshBalances = async (userAddress: string) => {
    setLoading(true);
    const res = await fetchAccountBalance(userAddress);
    setBalances(res);
    setLoading(false);
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const disconnect = () => {
    sessionStorage.removeItem('kaChing_user');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="text-primary" /> My Wallet
        </h1>
        <button 
          onClick={() => address && refreshBalances(address)}
          className={`p-2 bg-white/5 rounded-full hover:bg-white/10 transition ${loading ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Address Card */}
      <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Stellar Testnet Address</p>
          <div className="flex items-center gap-3 bg-dark/50 p-3 rounded-xl border border-white/5 group">
            <p className="text-xs font-mono text-gray-300 truncate flex-1">{address}</p>
            <button 
              onClick={copyAddress}
              className="p-2 hover:bg-primary/10 rounded-lg transition text-primary"
            >
              <Copy size={16} />
            </button>
          </div>
          {copied && <p className="text-[10px] text-primary mt-1 font-bold ml-1">Address copied!</p>}
        </div>

        <button 
          onClick={disconnect}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-dark rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <RefreshCw size={14} /> CHANGE WALLET
        </button>

        <div className="grid grid-cols-2 gap-3">
          <a 
            href={`https://stellar.expert/explorer/testnet/account/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl text-xs font-bold text-gray-400 hover:bg-white/10 transition"
          >
            <ExternalLink size={14} /> Explorer
          </a>
          <button 
            onClick={disconnect}
            className="flex items-center justify-center gap-2 py-3 bg-rose-500/10 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition"
          >
            <LogOut size={14} /> Disconnect
          </button>
        </div>
      </div>

      {/* Assets List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Assets & Balances</h2>
        <div className="grid gap-3">
          {balances.length > 0 ? (
            balances.map((asset, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={`${asset.code}-${asset.issuer}`}
                className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  asset.code === 'XLM' ? 'bg-primary text-dark' : 'bg-white/10 text-white'
                }`}>
                  {asset.code.substring(0, 1)}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">{asset.code}</h3>
                  <p className="text-[10px] text-gray-500 truncate">{asset.issuer ? `Issuer: ${asset.issuer.substring(0, 8)}...` : 'Stellar Native'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">{parseFloat(asset.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-gray-500 font-bold">{asset.code}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-10 text-center glass rounded-2xl border border-white/5">
              <p className="text-xs text-gray-500">No assets found</p>
            </div>
          )}
        </div>
      </div>

      {/* Security Info */}
      <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
          <Shield size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-primary">Connected via Freighter</h3>
          <p className="text-xs text-primary/70 leading-relaxed">
            Your private keys are securely managed by the Freighter extension. KaChing never sees your secret phrase.
          </p>
        </div>
      </div>
    </div>
  );
}
