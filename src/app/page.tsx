import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-4xl font-bold text-center text-gray-900">Automate and Manage Your AI Workflows with Ease</h1>
      <p className="mt-4 text-lg text-center text-gray-600">
        Effortlessly automate AI workflows for small teams. Streamline your processes and focus on what matters.
      </p>
      
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Key Features</h2>
        <ul className="list-disc list-inside">
          <li>AI model training scheduler to automate training processes on a defined timeline.</li>
          <li>Dashboard to monitor the status of AI agents and tasks in real-time.</li>
          <li>Task automation workflows with custom triggers for AI model actions.</li>
          <li>Integration with popular AI frameworks and tools (e.g., TensorFlow, PyTorch).</li>
          <li>Email and Slack notifications for task completions and failures.</li>
        </ul>
      </div>
      
      <div className="mt-8">
        <Link href="/get-started">
          <a className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Get Started
          </a>
        </Link>
      </div>
    </main>
  );
};

export default HomePage;