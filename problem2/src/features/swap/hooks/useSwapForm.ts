import { useMemo, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import * as yup from 'yup';
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

  const { handleSubmit, control, setValue, reset, getValues } = useForm<SwapFormData>({
    defaultValues: { fromAmount: '', fromToken: null, toToken: null },
    mode: 'onChange',
    resolver,
    criteriaMode: 'all',
  });

  const { errors, isValid } = useFormState({ control });

  const fromTokenOptions = useMemo(() => tokens, [tokens]);
  const toTokenOptions = useMemo(() => tokens, [tokens]);

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
    fromTokenOptions,
    toTokenOptions,
    errors,
    isSwapping,
    canSubmit: isValid,
    handleSubmit,
    onSubmit,
    setValue,
    getValues,
    getBalance,
  };
}
