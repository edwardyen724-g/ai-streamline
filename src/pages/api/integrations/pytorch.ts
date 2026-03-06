import type { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { FirebaseOptions } from "firebase-admin";

const firebaseConfig: FirebaseOptions = {
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)),
};

initializeApp(firebaseConfig);

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string };
}

const db = getFirestore();

const rateLimit = new Map<string, number>();

const RATE_LIMIT_TIME = 60000; // 1 minute

async function handlePyTorchIntegration(req: AuthedRequest, res: NextApiResponse) {
  const now = Date.now();
  const userKey = req.user?.uid;

  if (userKey) {
    const lastRequestTime = rateLimit.get(userKey) || 0;
    if (now - lastRequestTime < RATE_LIMIT_TIME) {
      return res.status(429).json({ message: "Too many requests, please try again later." });
    }
    rateLimit.set(userKey, now);
  } else {
    return res.status(403).json({ message: "Unauthorized access." });
  }

  try {
    if (req.method === "POST") {
      const { modelConfig } = req.body;

      if (!modelConfig) {
        return res.status(400).json({ message: "Model configuration is required." });
      }

      // Implement your PyTorch integration logic here
      const integrationResult = await db.collection("pytorchIntegrations").add({
        userId: req.user.uid,
        modelConfig,
        createdAt: new Date(),
      });

      return res.status(201).json({ id: integrationResult.id, message: "Integration successful." });
    } else {
      return res.setHeader("Allow", ["POST"]).status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authedReq: AuthedRequest = req as AuthedRequest;
  await handlePyTorchIntegration(authedReq, res);
}