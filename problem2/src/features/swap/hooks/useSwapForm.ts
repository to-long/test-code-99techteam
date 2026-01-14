import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWalletStore } from '../../wallet';
import { useSwapValidation } from './useSwapValidation';
import { type Token, useTokens } from './useTokens';

interface SwapFormData {
  fromAmount: string;
}

export function useSwapForm() {
  const tokens = useTokens();
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  const { deductBalance, addBalance, getBalance } = useWalletStore();

  // Get wallet balance for selected token
  const walletBalance = fromToken ? getBalance(fromToken.currency) : 0;

  // Get validation schema
  const { schema } = useSwapValidation({ walletBalance });

  const {
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<SwapFormData>({
    defaultValues: { fromAmount: '' },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const fromAmount = watch('fromAmount');

  // Re-validate when fromAmount changes (schema already has current walletBalance)
  useEffect(() => {
    if (fromAmount) {
      trigger('fromAmount');
    }
  }, [trigger, fromAmount]);

  // Derived states
  const hasValidTokens = fromToken && toToken && fromToken.currency !== toToken.currency;
  const canSubmit = isValid && hasValidTokens;

  const toAmount = useMemo(() => {
    if (!fromToken || !toToken || !fromAmount || Number.isNaN(Number(fromAmount))) return '';
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty, numbers, and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setValue('fromAmount', value);
    }
  };

  return {
    // Tokens
    tokens,
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    fromTokenOptions,
    toTokenOptions,

    // Amounts
    fromAmount,
    toAmount,
    walletBalance,
    exchangeRate,

    // Form state
    errors,
    isSwapping,
    canSubmit,

    // Handlers
    handleSubmit,
    handleSwapTokens,
    handleSetMax,
    handleAmountChange,
    onSubmit,
  };
}
