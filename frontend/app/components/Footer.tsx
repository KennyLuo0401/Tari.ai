import React from 'react';
import { Heart, Shield, Clock, Github, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="bg-zinc-900/80 backdrop-blur-lg border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-display text-lg tracking-tight text-white">Tari.ai</h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-body">
              AI-powered DeFi portfolio rebalancer that dynamically adjusts your asset allocation based on market signals.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Features</h4>
            <ul className="space-y-3">
              <li>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-2 text-zinc-300 hover:text-white transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-body">Smart Rebalancing</span>
                </motion.div>
              </li>
              <li>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-2 text-zinc-300 hover:text-white transition-colors"
                >
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-body">24/7 Market Analysis</span>
                </motion.div>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Connect</h4>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors font-body">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors font-body">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-zinc-400 font-body">
              © 2024 Tari.ai. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-sm text-zinc-400 font-body">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-white" />
              <span>by the Tari team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}