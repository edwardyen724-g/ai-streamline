import { NextApiResponse } from 'next';
import { sendEmail } from './emailService';
import { sendSlackNotification } from './slackService';

export const handleResponse = (res: NextApiResponse, status: number, message: string) => {
  res.status(status).json({ message });
};

export const notifyTaskCompletion = async (taskName: string, userEmail: string, slackChannel: string) => {
  try {
    await sendEmail(userEmail, `Task ${taskName} completed successfully!`);
    await sendSlackNotification(slackChannel, `🎉 Task ${taskName} has completed successfully!`);
  } catch (err) {
    console.error('Error notifying task completion:', err instanceof Error ? err.message : String(err));
  }
};

export const notifyTaskFailure = async (taskName: string, userEmail: string, slackChannel: string) => {
  try {
    await sendEmail(userEmail, `Task ${taskName} failed. Please check the dashboard for more details.`);
    await sendSlackNotification(slackChannel, `⚠️ Task ${taskName} has failed. Please investigate.`);
  } catch (err) {
    console.error('Error notifying task failure:', err instanceof Error ? err.message : String(err));
  }
};

export const formatTaskStatus = (status: 'pending' | 'in_progress' | 'completed' | 'failed') => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return 'Unknown Status';
  }
};