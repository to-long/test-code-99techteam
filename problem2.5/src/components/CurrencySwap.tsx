import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowDownUp, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useTokenPrices } from '../hooks/useTokenPrices';
import { TokenSelect } from './TokenSelect';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Label } from './ui/Label';

const swapSchema = z.object({
  amount: z.number({ invalid_type_error: "Please enter a valid amount" })
    .positive("Amount must be greater than 0"),
  fromCurrency: z.string().min(1, "Select a token"),
  toCurrency: z.string().min(1, "Select a token"),
}).refine(data => data.fromCurrency !== data.toCurrency, {
  message: "Select a different token",
  path: ["toCurrency"],
});

type SwapFormData = z.infer<typeof swapSchema>;

export const CurrencySwap = () => {
  const { tokens, isLoading, error: pricesError } = useTokenPrices();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid }
  } = useForm<SwapFormData>({
    resolver: zodResolver(swapSchema),
    mode: 'onChange'
  });

  const fromCurrency = watch('fromCurrency');
  const toCurrency = watch('toCurrency');
  const amount = watch('amount');

  // Calculate Exchange Rate and Output Amount
  const { outputAmount, exchangeRate } = useMemo(() => {
    const fromToken = tokens.find(t => t.currency === fromCurrency);
    const toToken = tokens.find(t => t.currency === toCurrency);
    
    if (fromToken && toToken) {
       const rate = fromToken.price / toToken.price;
       const out = amount ? amount * rate : 0;
       return { outputAmount: out, exchangeRate: rate };
    }
    return { outputAmount: 0, exchangeRate: null };
  }, [tokens, fromCurrency, toCurrency, amount]);

  const handleSwapDirection = () => {
    setValue('fromCurrency', toCurrency);
    setValue('toCurrency', fromCurrency);
    trigger();
  };
  
  const onSubmit = async (data: SwapFormData) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    const fromToken = tokens.find(t => t.currency === data.fromCurrency);
    const toToken = tokens.find(t => t.currency === data.toCurrency);
    // Calculate final amount again to be safe
    const finalAmount = (data.amount * (fromToken!.price / toToken!.price)).toFixed(4);
    
    setSuccessMessage(`Swapped ${data.amount} ${data.fromCurrency} for ${finalAmount} ${data.toCurrency}`);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  if (pricesError) {
      return (
          <div className="text-red-400 p-4 border border-red-500/20 rounded-xl bg-red-900/10 text-center">
              Failed to load prices. Please try again later.
          </div>
      );
  }

  return (
    <div className="w-full max-w-[480px] relative">


      <Card className="relative z-10 w-full">
         <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-white tracking-wide">Swap Assets</h2>
                <div className="flex items-center gap-2">
                    <div className={clsx("p-2 rounded-full transition-colors", isLoading ? "animate-spin text-blue-400" : "text-gray-400 hover:bg-white/5")}>
                        <RefreshCw className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* FROM Section */}
            <div className="space-y-4 mb-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-colors focus-within:border-blue-500/50 hover:bg-white/10">
                    <div className="flex justify-between mb-2">
                        <Label>From</Label>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <input 
                            type="number" 
                            step="any"
                            placeholder="0.00"
                            {...register('amount', { valueAsNumber: true })}
                            className="w-full bg-transparent text-3xl font-medium text-white placeholder-gray-600 focus:outline-none no-spinner"
                            autoComplete="off"
                        />
                        <div className="w-[140px] shrink-0">
                            <Controller
                                name="fromCurrency"
                                control={control}
                                render={({ field }) => (
                                    <TokenSelect 
                                        {...field} 
                                        tokens={tokens} 
                                        label=""
                                        error={errors.fromCurrency?.message}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    {errors.amount && (
                        <div className="mt-2 text-red-400 text-xs font-medium">{errors.amount.message}</div>
                    )}
                </div>
            </div>

            {/* Swap Switcher */}
            <div className="relative h-4 flex items-center justify-center z-10 my-2">
                <div className="absolute inset-x-0 h-[1px] bg-white/10" />
                <motion.button
                    type="button"
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSwapDirection}
                    className="relative bg-black/50 backdrop-blur border border-white/20 p-2 rounded-xl text-blue-400 hover:text-white hover:border-blue-500 transition-colors shadow-lg"
                >
                    <ArrowDownUp className="w-5 h-5" />
                </motion.button>
            </div>

            {/* TO Section */}
            <div className="space-y-4 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-colors hover:bg-white/10">
                    <div className="flex justify-between mb-2">
                        <Label>To</Label>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-full text-3xl font-medium text-gray-300 truncate font-mono">
                            {outputAmount > 0 ? outputAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 }) : "0.00"}
                        </div>
                        <div className="w-[140px] shrink-0">
                            <Controller
                                name="toCurrency"
                                control={control}
                                render={({ field }) => (
                                    <TokenSelect 
                                        {...field} 
                                        tokens={tokens} 
                                        label=""
                                        error={errors.toCurrency?.message}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Exchange Rate Info */}
            {exchangeRate && fromCurrency && toCurrency && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between text-xs text-gray-400 px-2 mb-6"
                >
                    <span className="font-medium">Exchange Rate</span>
                    <span className="font-mono bg-white/5 px-2 py-1 rounded">
                        1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                    </span>
                </motion.div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full h-14 text-lg"
                disabled={!isValid || isSubmitting || isLoading}
                isLoading={isSubmitting}
            >
                {isSubmitting ? "Swapping..." : "Confirm Swap"}
            </Button>

            {/* Success Message */}
            <AnimatePresence>
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-x-6 bottom-24 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-center text-sm font-medium backdrop-blur-md"
                    >
                        {successMessage}
                    </motion.div>
                )}
            </AnimatePresence>
         </form>
      </Card>
    </div>
  );
};
