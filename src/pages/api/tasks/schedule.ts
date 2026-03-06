import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Task } from '../../../lib/types'; // Assuming you have a Task type defined
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string };
}

const rateLimitMap = new Map<string, number>();

const rateLimit = (key: string) => {
  const now = Date.now();
  const limit = 5; // requests
  const windowMs = 60 * 1000; // 1 minute

  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, now);
    return true;
  }

  const firstRequestTime = rateLimitMap.get(key)!
  if (now - firstRequestTime < windowMs) {
    return false;
  }
  
  rateLimitMap.set(key, now); // reset the time
  return true;
};

const scheduleTask = async (data: Task) => {
  const taskRef = db.collection('tasks').doc();
  await taskRef.set(data);
  return taskRef.id;
};

const handler = async (req: AuthedRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!req.user || !rateLimit(req.user.uid)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const { title, schedule, userId } = req.body;

    if (!title || !schedule || !userId) {
      return res.status(400).json({ error: 'Missing title, schedule or userId' });
    }

    const taskId = await scheduleTask({ title, schedule, userId });
    return res.status(201).json({ taskId });
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

export default handler;