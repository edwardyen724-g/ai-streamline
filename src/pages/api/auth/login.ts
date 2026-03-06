import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert } from 'firebase-admin/app';
import rateLimit from 'express-rate-limit';

const app = initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS || '{}')),
});

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string };
}

const limiter = new Map<string, number>();

const rateLimitMiddleware = (req: AuthedRequest, res: NextApiResponse, next: () => void) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
  const currentTime = Date.now();
  const timeLimit = 60000; // 1 minute
  const requestCount = limiter.get(ip) || 0;

  if (requestCount >= 5 && currentTime - (limiter.get(`${ip}-time`) || 0) < timeLimit) {
    return res.status(429).json({ message: 'Too many requests. Please try again later.' });
  }

  limiter.set(ip, requestCount + 1);
  limiter.set(`${ip}-time`, currentTime);
  next();
};

const loginHandler = async (req: AuthedRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const userRecord = await getAuth().getUserByEmail(email);
    // Additional logic for validating password would be necessary, typically handled by a client SDK
    // Simulating successful login response for demonstration
    res.status(200).json({ message: 'Login successful', uid: userRecord.uid });
  } catch (err) {
    res.status(401).json({ message: err instanceof Error ? err.message : String(err) });
  }
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  rateLimitMiddleware(req as AuthedRequest, res, () => loginHandler(req as AuthedRequest, res));
};