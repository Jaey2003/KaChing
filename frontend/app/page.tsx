'use client';

import { useState, useEffect } from 'react';
import WalletConnect from '@/components/WalletConnect';
import SendForm from '@/components/SendForm';
import Dashboard from '@/components/Dashboard';
import Navigation from '@/components/Navigation';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const user = sessionStorage.getItem('kaChing_user');
    setIsConnected(!!user);

    const handleWalletConnect = () => {
      const user = sessionStorage.getItem('kaChing_user');
      setIsConnected(!!user);
    };

    window.addEventListener('wallet-connected', handleWalletConnect);
    return () => window.removeEventListener('wallet-connected', handleWalletConnect);
  }, []);

  if (!isConnected) {
    return (
      <main className="min-h-screen p-6 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 flex flex-col items-center">
          <div className="w-full flex flex-col items-center space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-primary">KaChing</h1>
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
        {activeTab === 'transfer' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Send Money</h1>
            <div className="glass p-6 rounded-3xl">
              <SendForm />
            </div>
          </div>
        )}
        {activeTab === 'activity' && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p>No recent activity</p>
          </div>
        )}
        {activeTab === 'wallet' && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p>Wallet settings coming soon</p>
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p>Profile settings coming soon</p>
          </div>
        )}
      </div>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}