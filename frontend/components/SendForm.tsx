'use client';

import { useState } from 'react';
import { connectWallet } from '@/lib/stellar';
import { Wallet } from 'lucide-react';

export default function WalletConnect() {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const handleConnect = async () => {
    const pk = await connectWallet();
    if (pk) {
      setPublicKey(pk);
      sessionStorage.setItem('kaChing_user', pk);
    }
  };

  return (
    <button
      onClick={handleConnect}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-dark font-semibold rounded-lg hover:opacity-90 transition"
    >
      <Wallet size={20} />
      {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : 'Connect Wallet'}
    </button>
  );
}