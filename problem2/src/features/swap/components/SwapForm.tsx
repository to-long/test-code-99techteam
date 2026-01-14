import { motion } from 'framer-motion';
import { Controller } from 'react-hook-form';
import { formatEuropeanNumber, parseEuropeanNumber } from '../../../shared/utils/formatNumber';
import { useSwapForm } from '../hooks/useSwapForm';
import { TokenSelector } from './TokenSelector';

export function SwapForm() {
  const {
    control,
    tokens,
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    walletBalance,
    exchangeRate,
    fromTokenOptions,
    toTokenOptions,
    errors,
    isSwapping,
    canSubmit,
    handleSubmit,
    onSubmit,
    setValue,
  } = useSwapForm();

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl"
      >
        {/* From Section */}
        <div
          className={`bg-black/20 rounded-2xl p-4 mb-2 ${errors.fromAmount ? 'ring-2 ring-amber-500/50' : ''}`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
              You Pay
            </span>
            <div className="flex items-center gap-2">
              {fromToken && (
                <button
                  type="button"
                  onClick={() => {
                    if (walletBalance > 0) {
                      setValue('fromAmount', walletBalance.toString());
                    }
                  }}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Balance: {walletBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </button>
              )}
              {fromToken && fromAmount && !Number.isNaN(Number(fromAmount)) && (
                <span className="text-xs text-white/50">
                  ≈ $
                  {(Number(fromAmount) * fromToken.price).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Controller
              control={control}
              name="fromAmount"
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={field.value ? formatEuropeanNumber(field.value) : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^[\d.,]*$/.test(value)) {
                      const parsed = parseEuropeanNumber(value);
                      if (parsed === '' || /^\d*\.?\d*$/.test(parsed)) {
                        field.onChange(parsed);
                      }
                    }
                  }}
                  className={`flex-1 bg-transparent text-3xl font-semibold text-white placeholder-white/30 focus:outline-none min-w-0 ${
                    errors.fromAmount ? 'text-amber-400' : ''
                  }`}
                />
              )}
            />
            <Controller
              control={control}
              name="fromToken"
              render={({ field }) => (
                <TokenSelector
                  tokens={fromTokenOptions}
                  selected={field.value}
                  onSelect={field.onChange}
                />
              )}
            />
          </div>
          {/* Validation Errors */}
          {errors.fromAmount && (
            <p className="text-xs text-amber-400 mt-2">{errors.fromAmount.message}</p>
          )}
          {errors.fromToken && (
            <p className="text-xs text-amber-400 mt-2">{errors.fromToken.message}</p>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-4 relative z-10">
          <motion.button
            type="button"
            onClick={() => {
              setValue('fromToken', toToken, { shouldValidate: true });
              setValue('toToken', fromToken, { shouldValidate: true });
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 border-2 border-slate-900/30"
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
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </motion.button>
        </div>

        {/* To Section */}
        <div className="bg-black/20 rounded-2xl p-4 mt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
              You Receive
            </span>
            {toToken && toAmount && (
              <span className="text-xs text-white/50">
                ≈ $
                {(Number(toAmount) * toToken.price).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="0,00"
              value={toAmount}
              readOnly
              className="flex-1 bg-transparent text-3xl font-semibold text-white placeholder-white/30 focus:outline-none cursor-default min-w-0"
            />
            <Controller
              control={control}
              name="toToken"
              render={({ field }) => (
                <TokenSelector
                  tokens={toTokenOptions}
                  selected={field.value}
                  onSelect={field.onChange}
                />
              )}
            />
          </div>
          {/* Validation Error */}
          {errors.toToken && (
            <p className="text-xs text-amber-400 mt-2">{errors.toToken.message}</p>
          )}
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
                1 {fromToken.currency} ={' '}
                {exchangeRate.toLocaleString(undefined, { maximumFractionDigits: 6 })}{' '}
                {toToken.currency}
              </span>
            </div>
          </motion.div>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSwapping || !canSubmit}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full mt-6 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/30"
        >
          {isSwapping ? (
            <span className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Swapping...
            </span>
          ) : (
            'Confirm Swap'
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
