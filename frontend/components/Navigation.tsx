'use client';

import { Home, Receipt, ArrowLeftRight, PieChart, Wallet, User } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'activity', label: 'ACTIVITY', icon: Receipt },
    { id: 'transfer', label: 'TRANSFER', icon: ArrowLeftRight },
    { id: 'pockets', label: 'POCKETS', icon: PieChart },
    { id: 'wallet', label: 'WALLET', icon: Wallet },
    { id: 'profile', label: 'PROFILE', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark/80 backdrop-blur-lg border-t border-white/10 px-6 py-3 pb-8 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center space-y-1 group"
            >
              <Icon size={24} className={`transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'
              }`} />
              <span className={`text-[10px] font-bold tracking-widest ${
                isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
