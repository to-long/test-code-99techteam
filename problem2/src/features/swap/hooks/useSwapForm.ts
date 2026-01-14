import { useMemo, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import * as yup from 'yup';
import { formatEuropeanNumber } from '../../../shared/utils/formatNumber';
import { useWalletStore } from '../../wallet';
import { type SwapFormData, createSchema } from './useSchema';
import { useTokens } from './useTokens';

export function useSwapForm() {
  const tokens = useTokens();
  const [isSwapping, setIsSwapping] = useState(false);
  const { deductBalance, addBalance, getBalance } = useWalletStore();

  // Create resolver that dynamically gets walletBalance
  const resolver = useMemo(() => {
    return async (values: SwapFormData) => {
      const walletBalance = values.fromToken ? getBalance(values.fromToken.currency) : 0;
      const schema = createSchema(walletBalance);
      try {
        const validated = await schema.validate(values, { abortEarly: false });
        return { values: validated, errors: {} };
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const errors: Record<string, { type: string; message: string }> = {};
          for (const err of error.inner) {
            if (err.path) {
              errors[err.path] = {
                type: err.type || 'validation',
                message: err.message,
              };
            }
          }
          return { values: {}, errors };
        }
        return { values: {}, errors: {} };
      }
    };
  }, [getBalance]);

  const { handleSubmit, control, watch, setValue, reset } = useForm<SwapFormData>({
    defaultValues: { fromAmount: '', fromToken: null, toToken: null },
    mode: 'onChange',
    resolver,
  });

  const { errors, isValid } = useFormState({ control });
  const { fromToken, toToken, fromAmount } = watch();

  // Get wallet balance
  const walletBalance = fromToken ? getBalance(fromToken.currency) : 0;

  // Calculate derived values
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

  const onSubmit = async (data: SwapFormData) => {
    if (!isValid || !data.fromToken || !data.toToken) return;

    const swapFromAmount = Number(data.fromAmount);
    const calculatedToAmount =
      data.fromToken && data.toToken && data.fromAmount
        ? (Number(data.fromAmount) * (data.fromToken.price / data.toToken.price)).toFixed(6)
        : '0';

    setIsSwapping(true);
    await new Promise((r) => setTimeout(r, 2000));

    deductBalance(data.fromToken.currency, swapFromAmount);
    addBalance(data.toToken.currency, Number(calculatedToAmount));

    setIsSwapping(false);
    reset({ fromAmount: '', fromToken: data.fromToken, toToken: data.toToken });
  };

  return {
    control,
    tokens,
    fromToken,
    toToken,
    fromAmount,
    toAmount: formatEuropeanNumber(toAmount),
    walletBalance,
    exchangeRate,
    fromTokenOptions,
    toTokenOptions,
    errors,
    isSwapping,
    canSubmit: isValid,
    handleSubmit,
    onSubmit,
    setValue,
  };
}
