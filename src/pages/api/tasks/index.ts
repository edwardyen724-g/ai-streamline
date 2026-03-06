import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { getTasksFromDB } from '../../../lib/db'; // Assuming a database utility file
import { rateLimit } from '../../../lib/rateLimit'; // Assuming a simple in-memory rate limiting utility

interface AuthedRequest extends NextApiRequest {
  user?: { id: string; email: string }; // Extend request with user information if needed
}

const limiter = new Map<string, { lastRequest: number; count: number }>();

const LIMIT = 10; // Max requests
const TIME_FRAME = 1000 * 60; // Time frame in milliseconds (1 minute)

const checkRateLimit = (ip: string) => {
  const now = Date.now();
  if (!limiter.has(ip)) {
    limiter.set(ip, { lastRequest: now, count: 1 });
    return true;
  }
  
  const { lastRequest, count } = limiter.get(ip)!;
  
  if (now - lastRequest > TIME_FRAME) {
    limiter.set(ip, { lastRequest: now, count: 1 });
    return true;
  } 
  
  if (count >= LIMIT) {
    return false;
  }
  
  limiter.set(ip, { lastRequest, count: count + 1 });
  return true;
};

const handler = async (req: AuthedRequest, res: NextApiResponse) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

  if (!checkRateLimit(ip as string)) {
    return res.status(429).json({ message: 'Too many requests, please try again later.' });
  }

  if (req.method === 'GET') {
    try {
      const tasks = await getTasksFromDB();
      return res.status(200).json(tasks);
    } catch (err) {
      return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
  }

  return res.setHeader('Allow', ['GET']).status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;