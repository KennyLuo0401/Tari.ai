import React from 'react';
import { motion } from 'framer-motion';

const pulseVariants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const glowVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 0.5, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export function AnimatedLogo() {
  return (
    <div className="relative group">
      <motion.div
        variants={glowVariants}
        initial="initial"
        animate="animate"
        className="absolute -inset-2 bg-white/20 rounded-full blur-lg"
      />
      <motion.div
        variants={pulseVariants}
        initial="initial"
        animate="animate"
        className="absolute -inset-0.5 bg-white/10 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000"
      />
      <div className="relative bg-black p-2 rounded-lg ring-1 ring-zinc-800 overflow-hidden">
        <div className="relative z-10 flex items-center justify-center w-8 h-8">
          <span className="text-2xl font-display font-bold text-white group-hover:text-gray-300 transition-colors">
            T
          </span>
        </div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  );
}