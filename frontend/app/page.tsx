'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, PieChart, ArrowRight, Wallet } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import WalletConnect from '@/components/WalletConnect';
import SendForm from '@/components/SendForm';
import Dashboard from '@/components/Dashboard';
import Activity from '@/components/Activity';
import PocketsView from '@/components/PocketsView';
import WalletView from '@/components/WalletView';
import ProfileView from '@/components/ProfileView';
import Navigation from '@/components/Navigation';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'home';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [transferMode, setTransferMode] = useState<'direct' | 'pockets' | null>(null);

  useEffect(() => {
    const user = sessionStorage.getItem('kaChing_user');
    setIsConnected(!!user);

    const handleWalletConnect = () => {
      const user = sessionStorage.getItem('kaChing_user');
      setIsConnected(!!user);
    };

    const handleTabChange = (e: any) => {
      setActiveTab(e.detail);
    };

    window.addEventListener('wallet-connected', handleWalletConnect);
    window.addEventListener('change-tab', handleTabChange);
    return () => {
      window.removeEventListener('wallet-connected', handleWalletConnect);
      window.removeEventListener('change-tab', handleTabChange);
    };
  }, []);

  // Reset transfer mode when switching tabs
  useEffect(() => {
    if (activeTab !== 'transfer') {
      setTransferMode(null);
    }
  }, [activeTab]);

  if (!isConnected) {
    return (
      <main className="min-h-screen p-6 flex items-center justify-center bg-dark">
        <div className="w-full max-w-md space-y-8 flex flex-col items-center">
          <div className="w-full flex flex-col items-center space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-primary tracking-tight">KaChing</h1>
              <p className="text-gray-400">Hear the savings. Split with purpose.</p>
            </div>
            <WalletConnect />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark text-white p-6 pb-32">
      <div className="max-w-md mx-auto">
        {activeTab === 'home' && <Dashboard />}
        {activeTab === 'pockets' && <PocketsView />}
        
        {activeTab === 'transfer' && (
          <div className="flex flex-col min-h-[calc(100vh-200px)]">
            <h1 className="text-2xl font-bold mb-6">Send Money</h1>
            
            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {!transferMode ? (
                  <motion.div 
                    key="selection"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <button
                      onClick={() => setTransferMode('direct')}
                      className="w-full group relative overflow-hidden glass p-6 rounded-3xl text-left border border-white/5 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <ArrowRight className="text-gray-400 group-hover:text-primary transition-colors" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">Direct Transfer</h3>
                          <p className="text-sm text-gray-400">Simple one-to-one transfer to any address.</p>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Send size={16} className="text-primary" />
                      </div>
                    </button>

                    <button
                      onClick={() => setTransferMode('pockets')}
                      className="w-full group relative overflow-hidden glass p-6 rounded-3xl text-left border border-white/5 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <PieChart className="text-primary" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">Financial Pockets</h3>
                          <p className="text-sm text-gray-400">Auto-split funds into tuition, savings, and more.</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-4 bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                        RECOMMENDED
                      </div>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="glass p-6 rounded-3xl"
                  >
                    <SendForm mode={transferMode} onBack={() => setTransferMode(null)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <Activity />
          </div>
        )}
        {activeTab === 'wallet' && <WalletView />}
        {activeTab === 'profile' && <ProfileView />}
      </div>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}