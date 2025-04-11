import React from 'react';
import { Bell, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedLogo } from './AnimatedLogo';

export function Header() {
  return (
    <header className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <AnimatedLogo />
            <div>
              <motion.h1 
                className="text-2xl font-bold text-white font-display tracking-tight"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Tari.ai
              </motion.h1>
              <motion.p 
                className="text-xs text-zinc-400 font-medium tracking-wider uppercase"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Tactical Rebalancing AI — feels fast, brainy
              </motion.p>
            </div>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <span className="absolute top-1 right-1 h-2 w-2 bg-white rounded-full animate-pulse"></span>
              <Bell className="h-5 w-5" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 text-white rounded-lg font-sans text-sm font-medium tracking-wide hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all duration-200"
            >
              <LogIn className="h-4 w-4" />
              <span>Connect Wallet</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}