import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

if (!admin.apps.length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string };
}

export default async function handler(req: AuthedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { modelId, schedule } = req.body;

    if (!modelId || !schedule) {
      return res.status(400).json({ message: 'Model ID and schedule are required.' });
    }

    // Additional logic to interface with TensorFlow or your scheduling system would go here

    // Simulated task saving to Firestore
    await db.collection('aiWorkflows').add({
      modelId,
      schedule,
      userId: req.user?.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ message: 'AI model training scheduled successfully.' });
    
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}