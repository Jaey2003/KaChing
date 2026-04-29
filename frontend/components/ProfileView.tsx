'use client';

import { User, Settings, Bell, Shield, HelpCircle, Info, ChevronRight, Moon, Globe, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfileView() {
  const userAddress = typeof window !== 'undefined' ? sessionStorage.getItem('kaChing_user') : null;

  const menuItems = [
    { icon: Bell, label: 'Notifications', value: 'On', color: 'text-blue-400' },
    { icon: Shield, label: 'Security & Privacy', value: 'Freighter', color: 'text-emerald-400' },
    { icon: Globe, label: 'Language', value: 'English', color: 'text-amber-400' },
    { icon: Moon, label: 'Appearance', value: 'Dark', color: 'text-purple-400' },
  ];

  const supportItems = [
    { icon: HelpCircle, label: 'Help Center' },
    { icon: Info, label: 'About KaChing' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center px-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="text-primary" /> Profile
        </h1>
        <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
          <Settings size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4 py-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-primary/40 p-1">
            <div className="w-full h-full rounded-full bg-dark flex items-center justify-center overflow-hidden">
              <User size={48} className="text-primary/50" />
            </div>
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary text-dark rounded-full shadow-lg border-2 border-dark transition-transform hover:scale-110 active:scale-95">
            <Camera size={14} />
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">KaChing Explorer</h2>
          <p className="text-xs text-gray-500 font-mono mt-1">
            {userAddress ? `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}` : 'Not Connected'}
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">App Settings</h3>
          <div className="glass rounded-3xl border border-white/5 overflow-hidden">
            {menuItems.map((item, idx) => (
              <button 
                key={item.label}
                className={`w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors ${
                  idx !== menuItems.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-200">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{item.value}</span>
                  <ChevronRight size={16} className="text-gray-700" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Support & Info</h3>
          <div className="glass rounded-3xl border border-white/5 overflow-hidden">
            {supportItems.map((item, idx) => (
              <button 
                key={item.label}
                className={`w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors ${
                  idx !== supportItems.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-white/5 text-gray-400">
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-200">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-gray-700" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Version Tag */}
      <div className="text-center">
        <p className="text-[10px] font-bold text-gray-700 tracking-widest uppercase">KaChing Remit v1.0.4-beta</p>
      </div>
    </div>
  );
}
