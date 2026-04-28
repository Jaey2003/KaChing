'use client';

import { Home, Receipt, ArrowLeftRight, Wallet, User } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'activity', label: 'ACTIVITY', icon: Receipt },
    { id: 'transfer', label: 'TRANSFER', icon: ArrowLeftRight, center: true },
    { id: 'wallet', label: 'WALLET', icon: Wallet },
    { id: 'profile', label: 'PROFILE', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark/80 backdrop-blur-lg border-t border-white/10 px-6 py-3 pb-8 z-50">
      <div className="max-w-md mx-auto flex justify-between items-end">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.center) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative -top-6 flex flex-col items-center group"
              >
                <div className={`p-4 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-dark scale-110 shadow-lg shadow-primary/40' 
                    : 'bg-primary/20 text-primary hover:bg-primary/30'
                }`}>
                  <Icon size={28} />
                </div>
                <span className={`text-[10px] font-bold mt-2 tracking-widest ${
                  isActive ? 'text-primary' : 'text-gray-500'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          }

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
