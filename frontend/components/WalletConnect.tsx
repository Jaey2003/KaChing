'use client';

import { useState } from 'react';
import { connectWallet } from '@/lib/stellar';
import { Wallet } from 'lucide-react';

export default function WalletConnect() {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const handleConnect = async () => {
    const pk = await connectWallet();
    if (pk && pk.length > 0) {
      setPublicKey(pk);
      sessionStorage.setItem('kaChing_user', pk);
      window.dispatchEvent(new Event('wallet-connected'));
    }
  };

  return (
    <div className="flex justify-center w-full">
      <button
        onClick={handleConnect}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-dark font-bold rounded-lg hover:opacity-90 transition shadow-lg shadow-primary/20"
      >
        <Wallet size={20} />
        {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : 'Connect Wallet'}
      </button>
    </div>
  );
}