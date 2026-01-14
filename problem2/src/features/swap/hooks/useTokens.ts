import { useMemo } from 'react';
import { tokenIcons } from '../../../shared/constants';
import { useWalletStore } from '../../wallet';

export interface Token {
  currency: string;
  price: number;
  icon: string;
}

export function useTokens() {
  const exchangeRates = useWalletStore((state) => state.exchangeRates);

  const tokens = useMemo(() => {
    // Get unique tokens with their prices
    const priceMap = new Map<string, number>();

    for (const rate of exchangeRates) {
      // Use the first price we encounter for each currency
      if (!priceMap.has(rate.currency)) {
        priceMap.set(rate.currency, rate.price);
      }
    }

    // Only include tokens that have both an icon and a price
    const tokenList: Token[] = [];

    for (const [currency, icon] of Object.entries(tokenIcons)) {
      const price = priceMap.get(currency);
      if (price !== undefined) {
        tokenList.push({ currency, price, icon });
      }
    }

    // Sort by price (highest first)
    return tokenList.sort((a, b) => b.price - a.price);
  }, [exchangeRates]);

  return tokens;
}
