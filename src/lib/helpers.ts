import { NextApiRequest } from 'next';
import axios from 'axios';

export interface AuthedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
  };
}

export const fetchWithRetries = async (url: string, options?: RequestInit, retries: number = 3): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios(url, options);
      return response.data;
    } catch (err) {
      if (i === retries - 1) {
        throw new Error(err instanceof Error ? err.message : String(err));
      }
    }
  }
};

export const transformDate = (dateString: string): Date => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string provided');
  }
  return date;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};