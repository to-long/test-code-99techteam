import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { WalletBalance } from './WalletBalance';

export function WalletPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key="wallet"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-screen w-full md:w-80 z-50"
        >
          <WalletBalance onClose={() => setIsOpen(false)} />
        </motion.div>
      ) : (
        <motion.button
          key="toggle"
          type="button"
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          exit={{ x: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-4 z-50 w-12 h-24 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 border-r-0 rounded-l-2xl flex flex-col items-center justify-center gap-2 transition-colors"
          aria-label="Open wallet"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <svg
            className="w-4 h-4 text-white/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
