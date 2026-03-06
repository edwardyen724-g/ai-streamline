import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import mongoose from 'mongoose';
import Task from '@/lib/models/Task'; // Adjust the import according to your models folder structure

interface AuthedRequest extends NextApiRequest {
  user?: {
    email: string;
    // Include additional user properties if needed
  };
}

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

const handler = async (req: AuthedRequest, res: NextApiResponse) => {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });

    if (!session || !session.user?.email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const tasks = await Task.find({ userEmail: session.user.email });

    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
};

export default handler;