import { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { rateLimit } from '../../../lib/rateLimit'; // adjust your path accordingly
import { Task } from '../../../types'; // adjust your path accordingly

const adminApp = initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

interface AuthedRequest extends NextApiRequest {
  user?: {
    id: string;
  };
}

const limiter = new Map<string, number>();

export default async function handler(
  req: AuthedRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { title, cronTime, teamId }: Task = req.body;

    if (!title || !cronTime || !teamId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Rate limiting
    const key = req.user?.id || 'anonymous';
    const currentTime = Date.now();
    if (!limiter.has(key)) {
      limiter.set(key, currentTime);
    } else if (currentTime - (limiter.get(key) as number) < 1000) {
      return res.status(429).json({ message: 'Too Many Requests' });
    } else {
      limiter.set(key, currentTime);
    }

    const taskRef = await db.collection('tasks').add({
      title,
      cronTime,
      teamId,
      createdAt: new Date(),
    });

    return res.status(201).json({ id: taskRef.id });
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}