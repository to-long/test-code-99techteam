import { useMemo } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import type { Token } from './useTokens';

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
  warning: string | null;
}

export interface SwapValidation {
  walletBalance: number;
  exceedsBalance: boolean;
  isValidAmount: boolean;
  canSubmit: boolean;
  validationResult: ValidationResult;
  getBalanceMessage: () => string;
}

interface UseSwapValidationParams {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
}

export function useSwapValidation({
  fromToken,
  toToken,
  fromAmount,
}: UseSwapValidationParams): SwapValidation {
  const getBalance = useWalletStore((state) => state.getBalance);

  // Get wallet balance for selected token
  const walletBalance = useMemo(() => {
    if (!fromToken) return 0;
    return getBalance(fromToken.currency);
  }, [fromToken, getBalance]);

  // Parse amount
  const parsedAmount = useMemo(() => {
    if (!fromAmount) return 0;
    const num = Number(fromAmount);
    return isNaN(num) ? 0 : num;
  }, [fromAmount]);

  // Check if amount is valid number
  const isValidAmount = useMemo(() => {
    if (!fromAmount) return false;
    return /^\d*\.?\d*$/.test(fromAmount) && parsedAmount > 0;
  }, [fromAmount, parsedAmount]);

  // Check if amount exceeds balance
  const exceedsBalance = useMemo(() => {
    if (!fromAmount || !fromToken || parsedAmount === 0) return false;
    return parsedAmount > walletBalance;
  }, [fromAmount, fromToken, parsedAmount, walletBalance]);

  // Full validation result
  const validationResult = useMemo((): ValidationResult => {
    // No token selected
    if (!fromToken) {
      return { isValid: false, error: 'Please select a token to send', warning: null };
    }

    if (!toToken) {
      return { isValid: false, error: 'Please select a token to receive', warning: null };
    }

    // Same token
    if (fromToken.currency === toToken.currency) {
      return { isValid: false, error: 'Cannot swap the same token', warning: null };
    }

    // No amount
    if (!fromAmount) {
      return { isValid: false, error: null, warning: null };
    }

    // Invalid amount format
    if (!/^\d*\.?\d*$/.test(fromAmount)) {
      return { isValid: false, error: 'Invalid amount format', warning: null };
    }

    // Zero or negative
    if (parsedAmount <= 0) {
      return { isValid: false, error: 'Amount must be greater than 0', warning: null };
    }

    // Exceeds balance
    if (exceedsBalance) {
      return {
        isValid: false,
        error: null,
        warning: `Insufficient balance. You have ${walletBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${fromToken.currency}`,
      };
    }

    return { isValid: true, error: null, warning: null };
  }, [fromToken, toToken, fromAmount, parsedAmount, exceedsBalance, walletBalance]);

  // Can submit the form
  const canSubmit = useMemo(() => {
    return validationResult.isValid && !exceedsBalance && isValidAmount;
  }, [validationResult.isValid, exceedsBalance, isValidAmount]);

  // Get formatted balance message
  const getBalanceMessage = () => {
    return `${walletBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${fromToken?.currency || ''}`;
  };

  return {
    walletBalance,
    exceedsBalance,
    isValidAmount,
    canSubmit,
    validationResult,
    getBalanceMessage,
  };
}
