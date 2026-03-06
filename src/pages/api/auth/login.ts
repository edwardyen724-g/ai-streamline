import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '../../../lib/firebase'; // Ensure you have firebase initialized in this path

const auth = getAuth(firebaseApp);

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string; email: string }; // Customize based on your user structure, if needed
}

export default async function login(req: AuthedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Optionally, you can attach user information to the request or session if needed
    req.user = { uid: user.uid, email: user.email };

    return res.status(200).json({ message: 'Login successful', user: { uid: user.uid, email: user.email } });
  } catch (err) {
    return res.status(401).json({ message: err instanceof Error ? err.message : String(err) });
  }
}