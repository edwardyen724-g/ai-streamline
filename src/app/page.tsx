'use client';

import React from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

const Page: React.FC = () => {
  const handleSignIn = async () => {
    try {
      await signIn('auth0');
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Automate and Manage Your AI Workflows with Ease</h1>
        <p className="mt-4 text-lg text-gray-600">
          Effortlessly automate AI workflows for small teams.
        </p>

        <div className="mt-8">
          <Image 
            src="/images/ai-streamline.png" 
            alt="AI Streamline" 
            width={600} 
            height={400} 
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 className="mt-10 text-2xl font-semibold">MVP Features:</h2>
        <ul className="mt-4 list-disc list-inside text-left max-w-xl mx-auto">
          <li>AI model training scheduler to automate training processes on a defined timeline.</li>
          <li>Dashboard to monitor the status of AI agents and tasks in real-time.</li>
          <li>Task automation workflows that allow users to create custom triggers for AI model actions.</li>
          <li>Integration with popular AI frameworks and tools (e.g., TensorFlow, PyTorch).</li>
          <li>Email and Slack notifications for task completions and failures.</li>
        </ul>

        <button 
          onClick={handleSignIn}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
        >
          Get Started
        </button>
      </div>
    </main>
  );
};

export default Page;