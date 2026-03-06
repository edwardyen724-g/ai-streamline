import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import initFirebaseAdmin from '../../../lib/firebaseAdmin';
import { setRateLimit } from '../../../lib/rateLimit';

initFirebaseAdmin();

interface AuthedRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

const rateLimit = new Map<string, number>();

export default async function signup(req: AuthedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (rateLimit.get(clientIp as string) >= 5) {
    return res.status(429).json({ message: 'Too many requests, please try again later.' });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await getAuth().createUser({
      email,
      password,
    });

    rateLimit.set(clientIp as string, (rateLimit.get(clientIp as string) || 0) + 1);
    setTimeout(() => {
      rateLimit.set(clientIp as string, (rateLimit.get(clientIp as string) || 1) - 1);
    }, 60000); // Reset after 1 minute

    return res.status(201).json({ uid: user.uid });
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}