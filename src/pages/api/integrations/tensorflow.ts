import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';

if (!admin.apps.length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)),
  });
}

const db = getFirestore();

interface AuthedRequest extends NextApiRequest {
  user?: {
    email: string;
    uid: string;
  };
}

const rateLimit = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_COUNT = 5; // max requests

const rateLimiter = (req: AuthedRequest) => {
  const key = req.user?.uid;
  const currentTime = Date.now();

  if (!key) {
    throw new Error('User is not authenticated');
  }

  const requestData = rateLimit.get(key) || { count: 0, lastRequest: 0 };

  if (currentTime - requestData.lastRequest > RATE_LIMIT_WINDOW) {
    requestData.count = 0;
  }

  requestData.count += 1;
  requestData.lastRequest = currentTime;

  if (requestData.count > RATE_LIMIT_COUNT) {
    throw new Error('Too many requests, please try again later.');
  }

  rateLimit.set(key, requestData);
};

export default async function handler(req: AuthedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    rateLimiter(req);
    
    const { modelConfig } = req.body;

    // Assume modelConfig will contain necessary parameters for TensorFlow integration
    // Add integration logic with TensorFlow

    // This is a placeholder for model training logic
    // Replace with actual integration with TensorFlow
    const result = await db.collection('models').add({
      ...modelConfig,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'Model integration successful', modelId: result.id });
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}