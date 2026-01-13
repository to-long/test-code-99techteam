import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useTokens, type Token } from '../hooks/useTokens';
import { useSwapValidation } from '../hooks/useSwapValidation';
import { useWalletStore } from '../store/useWalletStore';
import { TokenSelector } from './TokenSelector';

interface SwapFormData {
  fromAmount: string;
}

export function SwapForm() {
  const tokens = useTokens();
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  const { deductBalance, addBalance } = useWalletStore();

  const {
    handleSubmit,
    watch,
    setValue,
  } = useForm<SwapFormData>({
    defaultValues: { fromAmount: '' },
    mode: 'onChange',
  });

  const fromAmount = watch('fromAmount');

  // Use validation hook
  const {
    walletBalance,
    exceedsBalance,
    canSubmit,
    validationResult,
  } = useSwapValidation({ fromToken, toToken, fromAmount });

  const toAmount = useMemo(() => {
    if (!fromToken || !toToken || !fromAmount || isNaN(Number(fromAmount))) return '';
    const rate = fromToken.price / toToken.price;
    return (Number(fromAmount) * rate).toFixed(6);
  }, [fromToken, toToken, fromAmount]);

  const exchangeRate = useMemo(() => {
    if (!fromToken || !toToken) return null;
    return fromToken.price / toToken.price;
  }, [fromToken, toToken]);

  const fromTokenOptions = useMemo(() => {
    if (!toToken) return tokens;
    return tokens.filter((t) => t.currency !== toToken.currency);
  }, [tokens, toToken]);

  const toTokenOptions = useMemo(() => {
    if (!fromToken) return tokens;
    return tokens.filter((t) => t.currency !== fromToken.currency);
  }, [tokens, fromToken]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleSetMax = () => {
    if (fromToken && walletBalance > 0) {
      setValue('fromAmount', walletBalance.toString());
    }
  };

  const onSubmit = async (data: SwapFormData) => {
    if (!canSubmit || !fromToken || !toToken) return;

    const swapFromAmount = Number(data.fromAmount);
    const swapToAmount = Number(toAmount);

    setIsSwapping(true);
    await new Promise((r) => setTimeout(r, 2000));
    
    // Update wallet balances
    deductBalance(fromToken.currency, swapFromAmount);
    addBalance(toToken.currency, swapToAmount);
    
    setIsSwapping(false);
    setValue('fromAmount', '');
  };

  const getButtonText = () => {
    if (isSwapping) return null; // Will show spinner
    if (exceedsBalance) return 'Insufficient Balance';
    return 'Confirm Swap';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty, numbers, and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setValue('fromAmount', value);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl"
      >
        {/* From Section */}
        <div className={`bg-black/20 rounded-2xl p-4 mb-2 ${exceedsBalance ? 'ring-2 ring-amber-500/50' : ''}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">You Pay</span>
            <div className="flex items-center gap-2">
              {fromToken && (
                <button
                  type="button"
                  onClick={handleSetMax}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Balance: {walletBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </button>
              )}
              {fromToken && fromAmount && !isNaN(Number(fromAmount)) && (
                <span className="text-xs text-white/50">
                  ≈ ${(Number(fromAmount) * fromToken.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={fromAmount}
              onChange={handleAmountChange}
              className={`flex-1 bg-transparent text-3xl font-semibold text-white placeholder-white/30 focus:outline-none min-w-0 ${
                exceedsBalance ? 'text-amber-400' : ''
              }`}
            />
            <TokenSelector tokens={fromTokenOptions} selected={fromToken} onSelect={setFromToken} />
          </div>
          {/* Validation Error */}
          {validationResult.error && (
            <p className="text-xs text-red-400 mt-2">{validationResult.error}</p>
          )}
        </div>

        {/* Balance Warning */}
        {validationResult.warning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl mb-2 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-300">{validationResult.warning}</p>
          </motion.div>
        )}

        {/* Swap Button */}
        <div className="flex justify-center -my-4 relative z-10">
          <motion.button
            type="button"
            onClick={handleSwapTokens}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 border-2 border-slate-900/50"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </motion.button>
        </div>

        {/* To Section */}
        <div className="bg-black/20 rounded-2xl p-4 mt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">You Receive</span>
            {toToken && toAmount && (
              <span className="text-xs text-white/50">
                ≈ ${(Number(toAmount) * toToken.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="0.00"
              value={toAmount}
              readOnly
              className="flex-1 bg-transparent text-3xl font-semibold text-white placeholder-white/30 focus:outline-none cursor-default min-w-0"
            />
            <TokenSelector tokens={toTokenOptions} selected={toToken} onSelect={setToToken} />
          </div>
        </div>

        {/* Exchange Rate */}
        {exchangeRate && fromToken && toToken && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 px-4 py-3 bg-white/5 rounded-xl border border-white/10"
          >
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/50">Rate</span>
              <span className="text-white font-medium">
                1 {fromToken.currency} = {exchangeRate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toToken.currency}
              </span>
            </div>
          </motion.div>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSwapping || !canSubmit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/30"
        >
          {isSwapping ? (
            <span className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Swapping...
            </span>
          ) : (
            getButtonText()
          )}
        </motion.button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-white/40 mt-4">
        {tokens.length} tokens available • Prices from Switcheo
      </p>
    </>
  );
}
