'use client';

import { useState, useEffect } from 'react';
import { Send, Plus, Trash2, ChevronDown, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchAccountBalance, StellarAsset } from '@/lib/stellar';
import { motion, AnimatePresence } from 'framer-motion';

interface Pocket {
  id: string;
  name: string;
  percentage: number;
}

interface SendFormProps {
  mode: 'direct' | 'pockets';
  onBack: () => void;
}

export default function SendForm({ mode, onBack }: SendFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string>('XLM');
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);
  const [pockets, setPockets] = useState<Pocket[]>([
    { id: '1', name: 'Tuition', percentage: 50 },
    { id: '2', name: 'Savings', percentage: 30 },
    { id: '3', name: 'Medical', percentage: 20 },
  ]);
  const [balances, setBalances] = useState<StellarAsset[]>([]);

  useEffect(() => {
    const publicKey = sessionStorage.getItem('kaChing_user');
    if (publicKey) {
      fetchAccountBalance(publicKey).then((res) => {
        setBalances(res);
        const firstAssetWithBalance = res.find(a => parseFloat(a.balance) > 0);
        if (firstAssetWithBalance) {
          setSelectedAsset(firstAssetWithBalance.code);
        } else if (res.length > 0) {
          setSelectedAsset(res[0].code);
        }
      });
    }
  }, []);

  const addPocket = () => {
    const newId = Date.now().toString();
    setPockets([...pockets, { id: newId, name: 'New Pocket', percentage: 0 }]);
  };

  const removePocket = (id: string) => {
    if (pockets.length > 1) {
      setPockets(pockets.filter(p => p.id !== id));
    }
  };

  const updatePocket = (id: string, field: keyof Pocket, value: string | number) => {
    setPockets(pockets.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const totalPercentage = pockets.reduce((acc, p) => acc + (Number(p.percentage) || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let queryParams = `amount=${amount}&asset=${selectedAsset}&mode=${mode}&recipient=${recipient}`;
    
    if (mode === 'pockets') {
      if (totalPercentage !== 100) {
        alert(`Total allocation must be exactly 100%. Current total: ${totalPercentage}%`);
        return;
      }
      const pocketParams = pockets.map(p => `${p.name.toLowerCase()}=${p.percentage}`).join('&');
      queryParams += `&${pocketParams}`;
    } else {
      // For direct mode, we can assume 100% to a general pocket or just skip pocket logic on the next page
      queryParams += `&general=100`;
    }
    
    router.push(`/compare?${queryParams}`);
  };

  const hasMultipleAssets = balances.length > 1;
  const currentAsset = balances.find(a => a.code === selectedAsset);

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium mb-2 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to options
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Asset Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">
              {hasMultipleAssets ? 'Select Asset' : 'Source Asset'}
            </label>
            
            {hasMultipleAssets ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
                  className="w-full flex items-center justify-between p-4 bg-surface rounded-xl border border-white/10 hover:border-primary/50 transition-all text-left"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Available Balance</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-primary">
                        {currentAsset ? parseFloat(currentAsset.balance).toFixed(2) : '0.00'}
                      </span>
                      <span className="text-sm font-medium text-white">{selectedAsset}</span>
                    </div>
                  </div>
                  <ChevronDown size={20} className={`text-gray-400 transition-transform ${isAssetDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAssetDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl max-h-60 overflow-y-auto">
                    {balances.map((asset) => (
                      <button
                        key={`${asset.code}-${asset.issuer}`}
                        type="button"
                        onClick={() => {
                          setSelectedAsset(asset.code);
                          setIsAssetDropdownOpen(false);
                        }}
                        className={`w-full p-4 text-left hover:bg-white/5 transition flex justify-between items-center border-b border-white/5 last:border-0 ${selectedAsset === asset.code ? 'bg-primary/5' : ''}`}
                      >
                        <div>
                          <p className="text-sm font-bold text-white">{asset.code}</p>
                          <p className="text-xs text-gray-400">Balance: {parseFloat(asset.balance).toFixed(2)}</p>
                        </div>
                        {selectedAsset === asset.code && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full p-4 bg-surface rounded-xl border border-white/10">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Available Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">
                    {balances[0] ? parseFloat(balances[0].balance).toFixed(2) : '0.00'}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {balances[0] ? balances[0].code : 'XLM'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">
              Amount to Send ({selectedAsset})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
              className="w-full p-3.5 bg-dark border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Recipient Address</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="G..."
              className="w-full p-3.5 bg-dark border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              required
            />
          </div>

          {mode === 'pockets' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-2 space-y-4 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-1 ml-1">
                <label className="text-sm font-medium text-gray-300">Pocket Allocations</label>
                <span className={`text-xs font-bold ${totalPercentage === 100 ? 'text-primary' : 'text-rose-400'}`}>
                  Total: {totalPercentage}%
                </span>
              </div>
              
              <div className="space-y-3">
                {pockets.map((pocket) => (
                  <div key={pocket.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={pocket.name}
                      onChange={(e) => updatePocket(pocket.id, 'name', e.target.value)}
                      className="flex-1 p-2.5 bg-dark border border-white/10 rounded-lg text-white text-sm focus:ring-1 focus:ring-primary/30"
                      placeholder="Pocket Name"
                    />
                    <div className="relative w-24">
                      <input
                        type="number"
                        value={pocket.percentage}
                        onChange={(e) => updatePocket(pocket.id, 'percentage', parseInt(e.target.value) || 0)}
                        className="w-full p-2.5 bg-dark border border-white/10 rounded-lg text-white text-center text-sm focus:ring-1 focus:ring-primary/30"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">%</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePocket(pocket.id)}
                      disabled={pockets.length <= 1}
                      className="p-2.5 text-gray-500 hover:text-rose-400 disabled:opacity-30 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addPocket}
                className="w-full py-2.5 border border-dashed border-white/20 rounded-xl text-gray-400 text-sm hover:border-primary/50 hover:text-primary transition flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Pocket
              </button>
            </motion.div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-primary text-dark font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition shadow-lg shadow-primary/20 mt-2"
        >
          <Send size={20} /> {mode === 'pockets' ? 'Compare & Split' : 'Compare & Send'}
        </button>
      </form>
    </div>
  );
}
