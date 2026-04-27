'use client';

import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

export default function KaChingAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Coins size={120} className="text-accent" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-4xl font-bold text-accent whitespace-nowrap"
        >
          KA-CHING!
        </motion.h1>
      </div>
    </motion.div>
  );
}