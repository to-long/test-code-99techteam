import { useMemo } from 'react';
import * as yup from 'yup';
import type { Token } from './useTokens';

export interface SwapFormData {
  fromAmount: string;
  fromToken: Token | null;
  toToken: Token | null;
}

// Create schema based on walletBalance
export function createSchema(walletBalance: number): yup.ObjectSchema<SwapFormData> {
  return yup.object({
    fromToken: yup
      .mixed<Token>()
      .nullable()
      .required('Please select a token to swap from')
      .test('not-null', 'Please select a token to swap from', (value) => value !== null),
    toToken: yup
      .mixed<Token>()
      .nullable()
      .required('Please select a token to swap to')
      .test('not-null', 'Please select a token to swap to', (value) => value !== null)
      .test('different-token', 'Cannot swap the same token', function (value) {
        const { fromToken } = this.parent;
        if (!fromToken || !value) return true;
        return (fromToken as Token).currency !== (value as Token).currency;
      }),
    fromAmount: yup
      .string()
      .required('Please enter an amount')
      .matches(/^\d*\.?\d*$/, 'Invalid amount format')
      .test('positive', 'Amount must be greater than 0', (value) => {
        if (!value) return false;
        const num = Number(value);
        return !Number.isNaN(num) && num > 0;
      })
      .test(
        'balance',
        `Insufficient balance (max: ${walletBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })})`,
        (value) => {
          if (!value) return true;
          const num = Number(value);
          if (Number.isNaN(num)) return true;
          return num <= walletBalance;
        }
      ),
  });
}

export function useSchema(walletBalance: number) {
  const schema = useMemo(() => createSchema(walletBalance), [walletBalance]);
  return schema;
}
