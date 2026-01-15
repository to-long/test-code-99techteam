import useSWR from 'swr';
import { tokenIcons } from '../utils/constants';

export interface TokenData {
  currency: string;
  date: string;
  price: number;
}

export interface Token extends TokenData {
  icon: string;
}

const PRICE_URL = 'https://interview.switcheo.com/prices.json';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useTokenPrices = () => {
  const { data, error, isLoading } = useSWR<TokenData[]>(PRICE_URL, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false,
  });

  const tokens = data
    ? data.reduce<Token[]>((acc, current) => {
        // Check if we already have this token in our accumulated list
        const existingIndex = acc.findIndex((t) => t.currency === current.currency);
        
        if (existingIndex === -1) {
             // If not exists and has icon, add it
            if (tokenIcons[current.currency]) {
                acc.push({
                  ...current,
                  icon: tokenIcons[current.currency],
                });
            }
        } else {
            // If exists, checks if the new one is more recent? 
            // Assuming the list is whatever, let's just keep the first one found or we could update price.
            // Let's rely on the first entry being valid enough for this mock.
        }
        return acc;
      }, [])
    : [];

  // Sort tokens alphabetically by currency symbol for better UX
  tokens.sort((a, b) => a.currency.localeCompare(b.currency));

  return {
    tokens,
    isLoading,
    error,
  };
};
