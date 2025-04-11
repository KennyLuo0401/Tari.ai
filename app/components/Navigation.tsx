import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationProps {
  activeTab: 'chat' | 'records';
  onTabChange: (tab: 'chat' | 'records') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange('chat')}
            className={`relative px-6 py-3 flex items-center space-x-3 text-base font-sans tracking-wide transition-all duration-200 ${
              activeTab === 'chat'
                ? 'text-white'
                : 'text-zinc-400 hover:text-zinc-300'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs font-medium tracking-wider uppercase">AI Assistant</span>
            {activeTab === 'chat' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white/60 via-white to-white/60"
                initial={false}
              />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange('records')}
            className={`relative px-6 py-3 flex items-center space-x-3 text-base font-sans tracking-wide transition-all duration-200 ${
              activeTab === 'records'
                ? 'text-white'
                : 'text-zinc-400 hover:text-zinc-300'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium tracking-wider uppercase">Medical Records</span>
            {activeTab === 'records' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white/60 via-white to-white/60"
                initial={false}
              />
            )}
          </motion.button>
        </div>
      </div>
    </nav>
  );
}