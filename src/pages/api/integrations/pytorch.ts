import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

interface AuthedRequest extends NextApiRequest {
  user?: {
    uid: string;
    email: string;
  };
}

const handler = async (req: AuthedRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { modelDetails } = req.body;

      // Here you can integrate with PyTorch, e.g., scheduling a training job

      // Example response structure
      res.status(200).json({ success: true, message: 'PyTorch job scheduled.', jobId: '12345' });
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;