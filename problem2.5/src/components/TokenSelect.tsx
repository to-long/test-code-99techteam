import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { Token } from '../hooks/useTokenPrices';

interface TokenSelectProps {
  value: string;
  onChange: (value: string) => void;
  tokens: Token[];
  label: string;
  error?: string;
  className?: string;
}

export const TokenSelect = ({ value, onChange, tokens, label, error, className }: TokenSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch(''); // Reset search on close
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedToken = tokens.find((t) => t.currency === value);

  const filteredTokens = tokens.filter((t) =>
    t.currency.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={clsx("relative flex flex-col gap-1.5", className)} ref={containerRef}>
      <label className="text-sm font-medium text-gray-300 ml-1">{label}</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "relative flex items-center justify-between w-full h-14 pl-4 pr-3 bg-gray-900/50 border rounded-xl transition-all duration-200 backdrop-blur-sm hover:bg-gray-800/50",
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
            : isOpen
            ? "border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
            : "border-gray-700 hover:border-gray-600"
        )}
      >
        <div className="flex items-center gap-3">
          {selectedToken ? (
            <>
              <img 
                src={selectedToken.icon} 
                alt={selectedToken.currency} 
                className="w-7 h-7 object-contain"
              />
              <span className="text-lg font-semibold text-white tracking-wide">
                {selectedToken.currency}
              </span>
            </>
          ) : (
            <span className="text-gray-400 font-medium">Select Token</span>
          )}
        </div>
        <ChevronDown 
          className={clsx(
            "w-5 h-5 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180 text-blue-400"
          )} 
        />
      </button>

      {error && (
        <span className="text-xs text-red-400 ml-1 font-medium flex items-center gap-1">
            {error}
        </span>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 right-0 top-[calc(100%+8px)] p-2 bg-[#1a1b1e] border border-gray-700 rounded-xl shadow-2xl ring-1 ring-black/5"
          >
            {/* Search Input */}
            <div className="relative mb-2 px-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                autoFocus
              />
              {search && (
                <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredTokens.length > 0 ? (
                <div className="grid grid-cols-1 gap-1">
                  {filteredTokens.map((token) => (
                    <button
                      key={token.currency}
                      type="button"
                      onClick={() => {
                        onChange(token.currency);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={clsx(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left group",
                        token.currency === value
                          ? "bg-blue-500/10 text-blue-400"
                          : "hover:bg-gray-800 text-gray-300 hover:text-white"
                      )}
                    >
                      <img 
                        src={token.icon} 
                        alt={token.currency} 
                        className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{token.currency}</span>
                      </div>
                      {token.currency === value && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500 text-sm">
                  No tokens found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
